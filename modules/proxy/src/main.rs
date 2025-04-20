use pingora::prelude::*;
use async_trait::async_trait;
use log::{info, error};

struct LBProxy;

#[async_trait]
impl ProxyHttp for LBProxy {
    type CTX = ();
    fn new_ctx(&self) -> () { () }

    async fn upstream_peer(&self, _session: &mut Session, _ctx: &mut ()) -> Result<Box<HttpPeer>> {
        let host = "orchestrator";
        let port = 8080;
        let addr_str = format!("{}:{}", host, port);

        if tokio::net::lookup_host(&addr_str).await.is_err() {
            error!("Failed to resolve upstream address: {}", addr_str);

            return Err(Error::new(ErrorType::ConnectProxyFailure));
        }

        let http_peer = HttpPeer::new((host, port), false, "".to_string());

        Ok(Box::new(http_peer))
    }

    async fn upstream_request_filter(
        &self,
        _session: &mut Session,
        upstream_request: &mut RequestHeader,
        _ctx: &mut Self::CTX,
    ) -> Result<()> {
        let _ = upstream_request.insert_header(
            "X-Forwarded-For",
            _session.client_addr().expect("REASON").to_string(),
        );

        Ok(())
    }

    fn fail_to_connect(
        &self,
        _session: &mut Session,
        _peer: &HttpPeer,
        _ctx: &mut Self::CTX,
        _e: Box<Error>,
    ) -> Box<Error> {
        info!("Failed to connect to upstream");
        let error = Error::new(ErrorType::ConnectProxyFailure);

        return error;
    }
}

fn main() {
    env_logger::init();

    let mut server = Server::new(None).unwrap();
    server.bootstrap();

    let mut proxy = http_proxy_service(&server.configuration, LBProxy);
    proxy.add_tcp("0.0.0.0:8080");

    server.add_service(proxy);
    server.run_forever();
}
