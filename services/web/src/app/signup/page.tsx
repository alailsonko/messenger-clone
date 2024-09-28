"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"

type FormData = {
  email: string;
  username: string;
  password: string;
  "confirm-password": string;
};

export default function SignUpForm() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async (data: { email: string; username: string; password: string }) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("An error occurred while signing up")
      }

      return response.json()
    },
    onSuccess(data, variables, context) {
      console.log("Signed up successfully", data, variables, context)
    },
    onError(error, variables, context) {
      console.error("An error occurred while signing up", error, variables, context)
    },
  }, queryClient)

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate(data);
  };

  console.log({ isPending, isError, error, isSuccess })

  return (
    <div className="flex items-center justify-center min-h-screen">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your details below to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="john_doe"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password"  {...register("password", { required: "Password is required" })} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="confirm-password">Confirm Password</Label>
            </div>
            <Input 
            id="confirm-password" type="password" 
            {...register("confirm-password", { required: "Password is required" })} 
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          <Button variant="outline" className="w-full">
            Sign Up with Google
          </Button>
        </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Have an account?{" "}
          <Link href="/" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}