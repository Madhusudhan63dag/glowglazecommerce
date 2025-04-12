// const navbar=[
//     { id: 1, name: "Shop Categories", link: "/",
//         subItems: [
//             { id: 1, name: "Food Aisles", link: "#" },
//             { id: 2, name: "Made In Canada", link: "#" },
//             { id: 3, name: "Supplements", link: "#" },
//             { id: 4, name: "Beverages", link: "#" },
//             { id: 5, name: "Non-Toxic Home Care", link: "#" },
//             { id: 6, name: "Personal Care", link: "#" },
//             { id: 7, name: "Gift Shop", link: "#" },
//             { id: 8, name: "Kids Zone", link: "#" },
//             { id: 9, name: "Variety Packs", link: "#" },
//             { id: 10, name: "New Arrivals", link: "#" },
//         ]
//      },
//     { id:2, name: "Shop Brands", link: "/",
//         subItems: [
//             { id: 1, name: "Prima Kitchen", link: "#" },
//             { id: 2, name: "Kettle & Fire", link: "#" },
//             { id: 3, name: "Simple Mills", link: "#" },
//             { id: 4, name: "Nutpods", link: "#" },
//             { id: 5, name: "Lily's Sweets", link: "#" },
//             { id: 6, name: "Carbonaut", link: "#" },
//             { id: 7, name: "Kaizen", link: "#" },
//             { id: 8, name: "Kodiak Cakes", link: "#" },
//             { id: 9, name: "Hu Kitchen", link: "#" },
//             { id: 10, name: "Siete", link: "#" },
//             { id: 11, name: "Mid-Day Squares", link: "#" },
//             { id: 12, name: "Olipop", link: "#" },
//             { id: 13, name: "Poppi", link: "#" },
//             { id: 14, name: "Seven Sundays", link: "#" },
//             { id: 15, name: "Jovial", link: "#" },
//         ]
//      },
//     { id:3, name:"Shop Deals", link:"/",
//         subItems:[
//             { id: 1, name: "Jamieson 30% Off", link: "#" },
//             { id: 2, name: "The Grain Escape 10% Off", link: "#" },
//             { id: 3, name: "Cuisine Soleil 15% Off", link: "#" },
//             { id: 4, name: "One Degree Sale", link: "#" },
//             { id: 5, name: "Deals of the Month", link: "#" },
//             { id: 6, name: "Clearance", link: "#" },
//         ]
//     },
//     {
//         id: 4, name: "Shop Gift", link: "#",
//         subItems: [
//             { id: 1, name: "Natura Market eGift Card", link: "#" },
//             { id: 2, name: "Natura Market ₹25 Gift Card (Paper-Based)", link: "#" },
//             { id: 3, name: "Natura Market ₹50 Gift Card (Paper-Based)", link: "#" },
//             { id: 4, name: "Natura Market ₹100 Gift Card (Paper-Based)", link: "#" },
//             { id: 5, name: "Natura Market ₹10 Gift Card (Paper-Based)", link: "#" },
//             { id: 6, name: "Natura Market ₹75 Gift Card (Paper-Based)", link: "#" },
//         ]
//     }
// ]

// export default navbar;

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

