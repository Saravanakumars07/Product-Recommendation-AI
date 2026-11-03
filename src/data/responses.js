export const responses = {
  products: {
    jeans: { prompt: "Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)", budgets: [{min:500,max:1000,recommendation:"Wrogn"}] },
    smartphone: { prompt: "Please select your budget (10000 - 20000, 20000 - 30000)", budgets: [{min:10000,max:20000,recommendation:"Redmi Note 12"}] },
    laptop: { prompt: "Please select your budget (30000 - 60000, 60000 - 90000)", budgets: [{min:30000,max:60000,recommendation:"Lenovo IdeaPad"}] },
    "t-shirt": { prompt: "Please select your budget (200 - 500, 500 - 1000)", budgets: [{min:200,max:500,recommendation:"T-Shirt"}] }
  },
  fallback: "Sorry, I did not understand your query!"
};
