"use client";

interface StackType {
  name: string;
  schema: string;
}

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
import {
  useCreateEnvironment,
  useGetEnvironmentTypes,
} from "@/hooks/use-environment-hook";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  const { data, isError } = useGetEnvironmentTypes();
  const { mutateAsync: createEnvironment } = useCreateEnvironment();
  const [currentSchema, setCurrentSchema] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environment: "",
      stack: "",
      config: [],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "config",
  });

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

  const handleStackChange = (stackName: string) => {
    const selectedStack = data?.find((s: StackType) => s.name === stackName);
    if (selectedStack) {
      const parsedSchema = JSON.parse(selectedStack.schema);
      setCurrentSchema(parsedSchema);
      // Reset config fields
      form.setValue("config", []);
      // Add default fields based on schema
      Object.keys(parsedSchema.properties).forEach((key) => {
        append({ key, value: "" });
      });
    }
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
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleStackChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stack" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data &&
                      data.map((stack: StackType) => (
                        <SelectItem key={stack.name} value={stack.name}>
                          {stack.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {isError && (
                  <p className="text-red-500">Error fetching stack data</p>
                )}
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`config.${index}.key`}
                render={({ field: keyField }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input {...keyField} disabled value={field.key} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`config.${index}.value`}
                render={({ field: valueField }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        {...valueField}
                        placeholder={`Enter ${field.key}`}
                      />
                    </FormControl>
                    {currentSchema?.properties[field.key]?.description && (
                      <p className="text-sm text-gray-500">
                        {currentSchema.properties[field.key].description}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
