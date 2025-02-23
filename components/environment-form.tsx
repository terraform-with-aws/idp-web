"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateEnvironment } from "@/hooks/use-environment-hook";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  environment: z.string().min(3),
  stack: z.string(),
  config: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),
});

export function CreateEnvironmentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const {mutateAsync : createEnvironment} = useCreateEnvironment()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environment: "",
      stack: "",
      config: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "config",
  });

  const addKeyValue = () => {
    append({ key: "", value: "" });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form Data:", values);
    createEnvironment(values)
    .then((res) => {
        toast({
          title: "Login successful",
        });
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Sign up failed",
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="environment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environment Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stack</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`config.${index}.key`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`config.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addKeyValue}>
            <Plus className="w-4 h-4 mr-2" />
            Add config values
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
