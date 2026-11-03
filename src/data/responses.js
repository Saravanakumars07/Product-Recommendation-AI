export const responses = {
  products: {
    jeans: { prompt: "Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)", budgets: [{min:500,max:1000,recommendation:"Wrogn, Link: https://www.wrogn.in"}] },
    smartphone: { prompt: "Please select your budget (10000 - 20000, 20000 - 30000, 30000 - 40000)", budgets: [{min:10000,max:20000,recommendation:"Redmi Note 12, Link: https://www.mi.com"}] },
    laptop: { prompt: "Please select your budget (30000 - 60000, 60000 - 90000, 90000 - 120000)", budgets: [{min:30000,max:60000,recommendation:"Lenovo IdeaPad, Link: https://www.lenovo.com"}] },
    "t-shirt": { prompt: "Please select your budget (200 - 500, 500 - 1000, 1000 - 1500)", budgets: [{min:200,max:500,recommendation:"Cotton T-Shirt, Link: https://www.myntra.com"}] }
  },
  fallback: "Sorry, I did not understand your query!"
};