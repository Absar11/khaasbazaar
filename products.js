/*
  Trending Bazaar product catalog.
  Replace the demo products and ImgBB URLs with your real products.
  Discount is calculated automatically.
*/
const products = [
  {
    id: "TB004",
    name: "Water LED Sensor Diya",
    images: [
      "https://i.ibb.co/Mk5nW9Ts/diya-1.jpg",
      "https://i.ibb.co/8gRY3BSW/diya2.jpg",
      "https://i.ibb.co/ZpLj1JwM/diya3.jpg",
      "https://i.ibb.co/XZznRnv6/diya4.jpg"
    ],
    mrp: 499,
    sellingPrice: 249,
    deliveryCharge: 0,
    category: "Home Decor",
    trending: true,
    stockStatus: "in-stock",
    description: "Add water and watch these LED diyas light up. A reusable and hassle-free choice for Diwali, festivals, parties, home decoration and gifting.",
    specifications: {
      "Product Type": "Water Sensor LED Diya",
      "Color": "Terracotta Orange",
      "Power": "Battery Operated",
      "Activation": "Water Sensor",
      "Material": "Plastic",
      "Usage": "Decorative Lighting",
      "Reusable": "Yes"
    },
    variants: [
      {
        name: "12 Pcs",
        price: 249,
        stockStatus: "in-stock",
        images: ["https://i.ibb.co/Mk5nW9Ts/diya-1.jpg", "https://i.ibb.co/8gRY3BSW/diya2.jpg"]
      },
      {
        name: "24 Pcs",
        price: 399,
        stockStatus: "in-stock",
        images: ["https://i.ibb.co/ZpLj1JwM/diya3.jpg", "https://i.ibb.co/XZznRnv6/diya4.jpg"]
      }
    ]
  },
  {
    id: "TB001",
    name: "Mini Portable Chopper",
    images: ["https://i.ibb.co/placeholder/product-1.jpg"],
    mrp: 999,
    sellingPrice: 599,
    deliveryCharge: 40,
    category: "Kitchen",
    trending: true,
    stockStatus: "in-stock",
    description: "A compact kitchen helper for quick everyday chopping.",
    specifications: { Capacity: "500ml", Material: "Food-grade plastic", Usage: "Kitchen" },
    variants: []
  },
  {
    id: "TB002",
    name: "Rechargeable LED Lamp",
    images: ["https://i.ibb.co/placeholder/product-2.jpg"],
    mrp: 1299,
    sellingPrice: 799,
    category: "Home",
    trending: true,
    stockStatus: "in-stock",
    description: "Compact rechargeable LED lamp for desks and bedside use.",
    specifications: { Power: "5W", Charging: "USB", Usage: "Indoor" },
    variants: []
  },
  {
    id: "TB003",
    name: "Portable Electric Fan",
    images: ["https://i.ibb.co/placeholder/product-3.jpg"],
    mrp: 1499,
    sellingPrice: 899,
    category: "Gadgets",
    trending: true,
    stockStatus: "in-stock",
    description: "A compact portable fan for convenient everyday cooling.",
    specifications: { Power: "5W", Charging: "USB", Speed: "3 Levels" },
    variants: [
      { name: "Black", price: 899, stockStatus: "in-stock", images: ["https://i.ibb.co/placeholder/product-3-black.jpg"] },
      { name: "White", price: 949, stockStatus: "in-stock", images: ["https://i.ibb.co/placeholder/product-3-white.jpg"] }
    ]
  }
];
