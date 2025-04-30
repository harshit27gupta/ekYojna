const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Scheme = require("../Models/Scheme");
const cron = require("node-cron");

// Runs every day at 3 AM
require("dotenv").config({ path: __dirname + "/../.env" });
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));
const SERVICE_CATEGORIES = {
  "1126": "Financial Support & Loans",
  "1338": "Healthcare & Insurance",
  "1642": "Education & Scholarships",
  "345": "Technology & Innovation",
  "1993": "Housing & Infrastructure",
  "344": "Technology & Innovation",
  "11": "Agriculture & Rural Development",
  "1746": "Employment & Business",
  "1800": "Social Welfare & Disability Support",
  "2056": "Agriculture & Rural Development",
  "2538": "Women & Child Welfare",
  "2308": "Employment & Business",
  "2105": "Technology & Innovation"
};
function getSubCategory(text) {
  const str = text.toLowerCase();
  if (/irrigation|sprinkler|water|drip/.test(str)) return "Irrigation & Water";
  if (/soil|fertility|testing/.test(str)) return "Soil & Fertility";
  if (/seed|fertilizer|agrochemical/.test(str)) return "Seeds & Fertilizers";
  if (/equipment|machinery|tools/.test(str)) return "Equipment & Machinery";
  if (/insurance|pmfby|crop loss/.test(str)) return "Insurance";
  if (/loan|credit|financing/.test(str)) return "Credit & Loans";
  if (/market|msp|procurement|mandi/.test(str)) return "Market Access & MSP";
  if (/organic|natural|sustainable/.test(str)) return "Organic Farming";
  if (/livestock|dairy|poultry/.test(str)) return "Animal Husbandry";
  if (/training|skill|awareness/.test(str)) return "Training & Awareness";
  if (/technology|innovation|startup/.test(str)) return "Agri-Tech & Innovation";
  if (/farmer|cultivation|crop/.test(str)) return "Farming Support";
  return "General Agriculture";
}
const scrapeSchemesForService = async (serviceId, category) => {
  const allSchemes = [];

  for (let page = 1; page <= 12; page++) {
    try {
      const url = `https://services.india.gov.in/service/ministry_services?cmd_id=${serviceId}&ln=en&page_no=${page}`;
      console.log(` Fetching Service ID ${serviceId}, Page ${page}: ${url}`);

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const schemesOnPage = [];

      $(".ext-link").each((index, element) => {
        const title = $(element).text().trim();
        let link = $(element).attr("href");
        if (link && !link.startsWith("http")) {
          link = `https://services.india.gov.in${link}`;
        }

        const description = $(element).parent().nextAll("p").first().text().trim();
        const eligibility = $(element).closest(".listing-service").find(".listing-eligibility").text().trim();
        const subCategory = getSubCategory(`${description} ${eligibility}`);

        schemesOnPage.push({ title, link, description, eligibility, category, subCategory });
      });

      if (schemesOnPage.length === 0) {
        console.log(` No schemes found on page ${page}, ending early.`);
        break; 
      }

      console.log(` Page ${page}: Found ${schemesOnPage.length} schemes`);
      allSchemes.push(...schemesOnPage);
    } catch (error) {
      console.error(` Error scraping Service ID ${serviceId}, Page ${page}:`, error.message);
      break; 
    }
  }

  if (allSchemes.length > 0) {
    for (const scheme of allSchemes) {
      try {
        await Scheme.updateOne(
          { title: scheme.title, link: scheme.link },
          { $set: scheme },
          { upsert: true }
        );
      } catch (dbError) {
        console.error(` MongoDB Insert Error for ${scheme.title}:`, dbError.message);
      }
    }
    console.log(` Service ID ${serviceId}: Stored ${allSchemes.length} schemes in MongoDB!`);
  } else {
    console.log(` No schemes collected for Service ID ${serviceId}.`);
  }
};
const scrapeAllServices = async () => {
  for (const [serviceId, category] of Object.entries(SERVICE_CATEGORIES)) {
    await scrapeSchemesForService(serviceId, category);
  }
  mongoose.connection.close();
};
scrapeAllServices();
cron.schedule("0 3 * * *", async () => {
  console.log("⏰ Starting scheduled scrape...");
  await scrapeAllServices();
});