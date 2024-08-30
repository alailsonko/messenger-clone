-- Import only the User table from the foreign server
IMPORT FOREIGN SCHEMA public
LIMIT TO ("User")
FROM SERVER users_db_server
INTO public;
