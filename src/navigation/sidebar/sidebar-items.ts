import {
  Banknote,
  Calendar,
  ChartBar,
  FileText,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquare,
  ReceiptText,
  Settings,
  ShoppingBag,
  SquareArrowUpRight,
  Users,
  Vote,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  // {
  //   id: 1,
  //   label: "Dashboards",
  //   items: [
  //     {
  //       title: "CRM",
  //       url: "/dashboard/crm",
  //       icon: ChartBar,
  //     },
  //     {
  //       title: "Finance",
  //       url: "/dashboard/finance",
  //       icon: Banknote,
  //     },
  //     {
  //       title: "Analytics",
  //       url: "/dashboard/coming-soon",
  //       icon: Gauge,
  //       comingSoon: true,
  //     },
  //     {
  //       title: "E-commerce",
  //       url: "/dashboard/coming-soon",
  //       icon: ShoppingBag,
  //       comingSoon: true,
  //     },
  //     {
  //       title: "Academy",
  //       url: "/dashboard/coming-soon",
  //       icon: GraduationCap,
  //       comingSoon: true,
  //     },
  //     {
  //       title: "Logistics",
  //       url: "/dashboard/coming-soon",
  //       icon: Forklift,
  //       comingSoon: true,
  //     },
  //   ],
  // },
  {
    id: 2,
    label: "Secciones",
    items: [
      {
        title: "Congresistas",
        url: "/sections/congressmen",
        icon: Users,
      },
      {
        title: "Partidos",
        url: "/sections/parties",
        icon: GraduationCap,
      },
      {
        title: "Leyes y proyectos",
        url: "/sections/bills",
        icon: FileText,
      },
      {
        title: "Sesiones",
        url: "/sections/sessions",
        icon: Calendar,
      },
      {
        title: "Jefes Politicos",
        url: "/sections/leaders",
        icon: Vote,
      },
      {
        title: "Provincias",
        url: "/sections/provinces",
        icon: MapPin,
      },
      {
        title: "Estrategias Oficialistas",
        url: "/sections/official-vote-preferences",
        icon: Vote,
      },
    ],
  },
  {
    id: 3,
    label: "Configuración",
    items: [
      {
        title: "Configuración",
        url: "/sections/configuration",
        icon: Settings,
      },
    ],
  },
];
