import Link from "next/link"

import ModeToggle from '@/components/light-dark'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator";
import { Menu, Landmark, Save, Archive, Clock,
  Microscope, UserCircle, Leaf, MapPinned,
  Music, Globe2, HeartPulse, BrainCircuit, PlayCircle, BrainCircuitIcon,
  User, Search, Zap, Users, Star, ArrowRight, Pyramid, Gamepad2, Video, Image, FileText, ShoppingBag
} from 'lucide-react';

import Userbar from '@/components/auth/userbar';
import { t, ut, Lang } from '@/lib/global';

const CATEGORIES = [
  { id: "auth", label: 'Account', icon: User, color: "text-purple-500", bg: "bg-purple-50" },
];

interface Props {
  translate: Lang;
  hideSearchbar: boolean;
}

export default function Header({ translate, hideSearchbar = false }: Props) {
  return (
    <header className="sticky top-0 z-2 h-[4rem] bg-background/95">
      <div className="flex mx-auto h-full items-center justify-between max-w-[100rem] px-4 gap-4">
        <div className="flex-1 flex justify-start gap-2">
          <Link href={'/'} className="text-lg font-bold tracking-tighter">
            Auth
          </Link>
        </div>

        <div className="flex items-center justify-center w-[50rem]">
        </div>

        <nav className="flex-1 flex justify-end items-center gap-1">
          <ModeToggle />
          <Popover>
            <PopoverTrigger className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors overflow-hidden">
              <Menu className="h-4 w-4 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-max px-6 py-4 mx-auto gap-2">
              <p className="pb-4 text-lg font-bold tracking-tighter">
                Services
              </p>
              <nav className="grid grid-cols-3 gap-4">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className="w-[72px] h-[72px] no-underline rounded-2xl border border-transparent 
                      flex flex-col items-center justify-center
                      group relative hover:border-border hover:bg-muted/50 hover:shadow-md
                      transition-all duration-300 ease-in-out
                      transform hover:-translate-y-0.5"
                  >
                    <category.icon
                      className={`w-8 h-8 mb-1 shrink-0
                        ${category.color} 
                        transition-transform duration-300 ease-out
                        group-hover:scale-110`}
                    />

                    <span className="text-[0.8rem] font-medium text-center block w-full truncate tracking-tight
                      group-hover:scale-105 transition-all duration-300 ease-out opacity-90 group-hover:opacity-100"
                    >
                      {category.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </PopoverContent>
          </Popover>
          <Userbar ut={ut(translate)} authServer={''} />
        </nav>
      </div>
    </header>
  );
}
