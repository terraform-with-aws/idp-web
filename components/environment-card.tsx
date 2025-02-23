import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Trash2 } from "lucide-react";
import { Environment } from "@/app/(root)/page";
import { useDestroyEnvironment } from "@/hooks/use-environment-hook";
import { useToast } from "@/hooks/use-toast";

export enum EnvironmentStatus {
  REGISTERED = "REGISTERED",
  COMMITTED = "COMMITTED",
  DEPLOYED = "DEPLOYED",
  MARKED = "MARKED",
  FAILED = "FAILED",
}

const statusColors: { [key in EnvironmentStatus]: string } = {
  [EnvironmentStatus.REGISTERED]: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
  [EnvironmentStatus.COMMITTED]: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
  [EnvironmentStatus.DEPLOYED]: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  [EnvironmentStatus.MARKED]: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
  [EnvironmentStatus.FAILED]: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
};

const EnvironmentCard = ({ env }: { env: Environment }) => {
  const [open, setOpen] = useState(false);
  const {mutateAsync : detroy} = useDestroyEnvironment();
  const {toast} = useToast()
  const handleDestroy = () => {
    // TODO: Implement destroy logic
    console.log("Destroying environment:", env.environment);
    detroy(env.environment)
    .then(() => {
      toast({
        title: "Enviroment deleted",
      });
    })
    .catch(() => {
      toast({
        variant: "destructive",
        title: "Failed",
      });
    })
    setOpen(false)
  };

  return (
    <Card className="mb-4 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/10 border dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-xl font-bold dark:text-gray-100">
            {env.environment}
          </CardTitle>
          <CardDescription className="text-sm font-medium dark:text-gray-400">
            {env.stack}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            className={`px-3 py-1 text-sm font-semibold ${
              statusColors[env.status as EnvironmentStatus] ||
              "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            }`}
          >
            {env.status}
          </Badge>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Destroy Environment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to destroy the environment "{env.environment}"? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleDestroy();
                  }}
                >
                  Destroy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none dark:text-gray-400">Owner</p>
            <p className="text-sm dark:text-gray-100">{env.owner}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none dark:text-gray-400">DNS Name</p>
            <p className="text-sm dark:text-gray-100">{env.note.split("lbDnsName = ")[1]}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium leading-none dark:text-gray-400">Configuration</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(env.config).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm font-medium dark:text-gray-400">{key}</p>
                <p className="text-sm dark:text-gray-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentCard;
