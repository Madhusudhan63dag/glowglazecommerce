const navbar = [
  {
    id: 1,
    name: "Shop Categories",
    link: "/",
    subItems: [
      { id: 1, name: "Ayurvedic Medicine", link: "/trending?category=ayurvedic-medicine" },
      { id: 2, name: "Body Slim", link: "/trending?category=body-slim" },
      { id: 3, name: "Skin Care", link: "/trending?category=skin-care" },
      // { id: 4, name: "PSORIGO Oil", link: "#" },
      // { id: 5, name: "PSORIGO Body Wash", link: "#" },
      // { id: 6, name: "PSORIGO Body Lotion", link: "#" },
    ]
  },
  // {
  //   id: 2,
  //   name: "Shop Brands",
  //   link: "/",
  //   subItems: [
  //     { id: 1, name: "Sampoorn Arogya", link: "#" },
  //     { id: 2, name: "Dr. Joints", link: "#" },
  //     { id: 3, name: "Beyondslim", link: "#" },
  //     { id: 4, name: "PSORIGO", link: "#" }
  //   ]
  // },
  {
    id: 3,
    name: "Shop Deals",
    link: "/",
    subItems: [
      { id: 1, name: "Sampoorn Arogya Offer", link: "/deals/sampoorn-arogya" },
      { id: 2, name: "Dr. Joints Discount", link: "/deals/dr-joints" },
      { id: 3, name: "Beyondslim Special", link: "/deals/beyondslim" },
      { id: 4, name: "PSORIGO Exclusive Deals", link: "/deals/psorigo" }
    ]
  },
  {
    id: 4,
    name: "Shop Gift",
    link: "#",
    subItems: [
      // { id: 1, name: "Sampoorn Arogya Gift Set", link: "#" },
      // { id: 2, name: "Dr. Joints Gift Pack", link: "#" },
      // { id: 3, name: "Wellness Gift Basket", link: "#" },
      { id: 4, name: "PSORIGO Skin Care", link: "/offers" },
      // { id: 5, name: "Custom Gift Packs", link: "#" }
    ]
  }
];

export default navbar;

