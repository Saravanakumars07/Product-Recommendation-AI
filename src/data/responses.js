export const responses = {
  products: {
    jeans: { 
      prompt: "Please select your budget (500 - 1000, 1000 - 1500, 1500 - 2000)", 
      budgets: [
        {min:500,max:1000,recommendation:"Here are your product suggestions:-\nWrogn, Link: https://www.wrogn.in"},
        {min:1000,max:1500,recommendation:"Levi's, Link: https://www.levi.in"},
        {min:1500,max:2000,recommendation:"Jack & Jones, Link: https://www.jackjones.in"}
      ] 
    },
    smartphone: { 
      prompt: "Please select your budget (10000 - 20000, 20000 - 30000, 30000 - 40000)", 
      budgets: [
        {min:10000,max:20000,recommendation:"Redmi Note 12, Link: https://www.mi.com"},
        {min:20000,max:30000,recommendation:"OnePlus Nord, Link: https://www.oneplus.in"},
        {min:30000,max:40000,recommendation:"iPhone 14, Link: https://www.apple.com"}
      ] 
    },
    laptop: { 
      prompt: "Please select your budget (30000 - 60000, 60000 - 90000, 90000 - 120000)", 
      budgets: [
        {min:30000,max:60000,recommendation:"Lenovo IdeaPad, Link: https://www.lenovo.com"},
        {min:60000,max:90000,recommendation:"HP Pavilion, Link: https://www.hp.com"},
        {min:90000,max:120000,recommendation:"MacBook Air, Link: https://www.apple.com"}
      ] 
    },
    "t-shirt": { 
      prompt: "Please select your budget (200 - 500, 500 - 1000, 1000 - 1500)", 
      budgets: [
        {min:200,max:500,recommendation:"Cotton T-Shirt, Link: https://www.myntra.com"},
        {min:500,max:1000,recommendation:"Polo T-Shirt, Link: https://www.myntra.com"},
        {min:1000,max:1500,recommendation:"Branded Pack, Link: https://www.myntra.com"}
      ] 
    },
  },
  fallback: "Sorry, I did not understand your query!"
};