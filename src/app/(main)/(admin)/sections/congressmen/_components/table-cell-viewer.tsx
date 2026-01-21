import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

import type { person } from "@/lib/db/schema";

type PersonRow = typeof person.$inferSelect;

export function TableCellViewer({ item }: { item: PersonRow }) {
  const isMobile = useIsMobile();
  const fullName = `${item.firstName} ${item.lastName}`;
  const birthDateValue = item.birthDate ?? "";

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {fullName}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{fullName}</DrawerTitle>
          <DrawerDescription>Detalles basados en el schema de persons.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" defaultValue={item.firstName} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" defaultValue={item.lastName} />
              </div>
              <div className="flex flex-col gap-3">
              <Label htmlFor="birth-date">Birth date</Label>
              <Input id="birth-date" defaultValue={birthDateValue} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" defaultValue={item.gender ?? ""} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="original-province">Original province</Label>
            <Input id="original-province" defaultValue={item.original_province?.toString() ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" defaultValue={item.instagram ?? ""} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" defaultValue={item.facebook ?? ""} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" defaultValue={item.twitter ?? ""} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="tik-tok">TikTok</Label>
                <Input id="tik-tok" defaultValue={item.tik_tok ?? ""} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="biography">Biography</Label>
              <Textarea id="biography" defaultValue={item.biography ?? ""} />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
