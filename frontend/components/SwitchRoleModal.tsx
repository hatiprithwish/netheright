// DONE_PRITH

"use client";

import { useState } from "react";
import { useAuth } from "@/frontend/hooks/useAuth";
import { useGetRoles } from "@/frontend/api/cachedQueries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/frontend/components/shadcn/dialog";
import { Button } from "@/frontend/components/shadcn/button";
import { Label } from "@/frontend/components/shadcn/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/frontend/components/shadcn/radio-group";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/frontend/api/mutations";
import { useSession } from "next-auth/react";

interface SwitchRoleModalProps {
  children: React.ReactNode;
}

export function SwitchRoleModal({ children }: SwitchRoleModalProps) {
  const { currentUser } = useAuth();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useGetRoles();

  const handleSwitch = async () => {
    try {
      setIsSubmitting(true);
      if (
        !selectedRoleId ||
        selectedRoleId === currentUser?.roleId ||
        !currentUser
      ) {
        setOpen(false);
        return;
      }
      await updateUserRole(currentUser.id, { roleId: selectedRoleId });

      // DEV_NOTE: Force JWT callback to run and issue fresh token with new permissions
      await update({ roleId: selectedRoleId });

      toast.success("Role updated successfully.");
      setOpen(false);
    } catch (error) {
      // TODO: add sentry log
      toast.error("Failed to update role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Role</DialogTitle>
          <DialogDescription>
            Change your current role to test different permissions and features
            within the application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="col-span-4 mt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RadioGroup
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                disabled={isSubmitting}
                className="gap-3"
              >
                {data?.roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    <RadioGroupItem value={role.id} id={role.id} />
                    <Label
                      htmlFor={role.id}
                      className="flex-1 font-medium leading-none"
                    >
                      {role.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSwitch}
            disabled={
              isSubmitting ||
              isLoading ||
              !selectedRoleId ||
              selectedRoleId === currentUser?.roleId
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
