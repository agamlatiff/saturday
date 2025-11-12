export interface NavigationChildItem {
  label: string;
  path: string;
  iconBlack: string;
  iconBlue: string;
}

export interface NavigationItem {
  label: string;
  path?: string;
  iconBlack: string;
  iconBlue: string;
  roles: string[];
  children?: NavigationChildItem[];
}

export interface NavigationSection {
  section: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    section: "Main Menu",
    items: [
      {
        label: "Overview",
        path: "/overview",
        iconBlack: "/assets/images/icons/home-black.svg",
        iconBlue: "/assets/images/icons/home-blue-fill.svg",
        roles: ["manager"],
      },
      {
        label: "Overview",
        path: "/overview-merchant",
        iconBlack: "/assets/images/icons/home-black.svg",
        iconBlue: "/assets/images/icons/home-blue-fill.svg",
        roles: ["keeper"],
      },
      {
        label: "Products",
        path: "/products",
        iconBlack: "/assets/images/icons/bag-black.svg",
        iconBlue: "/assets/images/icons/bag-blue-fill.svg",
        roles: ["manager"],
      },
      {
        label: "Transactions",
        path: "/transactions",
        iconBlack: "/assets/images/icons/card-black.svg",
        iconBlue: "/assets/images/icons/card-blue-fill.svg",
        roles: ["keeper"],
      },
      {
        label: "Categories",
        path: "/categories",
        iconBlack: "/assets/images/icons/note-2-black.svg",
        iconBlue: "/assets/images/icons/note-2-blue-fill.svg",
        roles: ["manager"],
      },
      {
        label: "Warehouses",
        path: "/warehouses",
        iconBlack: "/assets/images/icons/buildings-2-black.svg",
        iconBlue: "/assets/images/icons/buildings-2-blue-fill.svg",
        roles: ["manager"],
      },
      {
        label: "Merchants",
        path: "/merchants",
        iconBlack: "/assets/images/icons/shop-black.svg",
        iconBlue: "/assets/images/icons/shop-blue-fill.svg",
        roles: ["manager"],
      },
      {
        label: "My Merchant",
        path: "/my-merchant",
        iconBlack: "/assets/images/icons/shop-black.svg",
        iconBlue: "/assets/images/icons/shop-blue-fill.svg",
        roles: ["keeper"],
      },
    ],
  },
  {
    section: "Account Settings",
    items: [
      {
        label: "Roles",
        path: "/roles",
        iconBlack: "/assets/images/icons/stickynote-black.svg",
        iconBlue: "/assets/images/icons/stickynote-blue-fill.svg",
        roles: ["manager"],
      },
      {
        label: "Manage Users",
        iconBlack: "/assets/images/icons/user-square-black.svg",
        iconBlue: "/assets/images/icons/user-square-black.svg",
        roles: ["manager"],
        children: [
          {
            label: "Users List",
            path: "/users",
            iconBlack: "/assets/images/icons/profile-2user-black.svg",
            iconBlue: "/assets/images/icons/profile-2user-blue-fill.svg",
          },
          {
            label: "Assign Role",
            path: "/users/assign-roles",
            iconBlack: "/assets/images/icons/profile-tick-black.svg",
            iconBlue: "/assets/images/icons/profile-tick-blue.svg",
          },
        ],
      },
      {
        label: "Settings",
        path: "/settings",
        iconBlack: "/assets/images/icons/setting-black.svg",
        iconBlue: "/assets/images/icons/setting-black.svg",
        roles: ["manager", "keeper"],
      },
    ],
  },
];

