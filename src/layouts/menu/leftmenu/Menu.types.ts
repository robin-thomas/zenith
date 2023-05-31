export interface MenuProps {
  title: string;
  items: {
    name: string;
    href: string;
    icon: any;
    description: string;
  }[];
  selectedMenu: string | undefined;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string | undefined>>;
}
