import type { MarketData, StockData } from "@/types/stock"

// API Configuration
const API_KEY = "7696b7bb38974a72afa6d192b3c76282"
const BASE_URL = "https://api.twelvedata.com"
const DEMO_MODE = false // Changed to false to use real API data

// Cache management with longer duration
interface CacheItem<T> {
  data: T
  timestamp: number
}

const cache: Record<string, CacheItem<any>> = {}
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes cache (increased from 5)

// Rate limiting with more conservative settings
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests (increased from 1.2)
let creditUsageThisMinute = 0
let lastCreditResetTime = Date.now()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Reset credit counter every minute
setInterval(() => {
  creditUsageThisMinute = 0
  lastCreditResetTime = Date.now()
  // Removed console.log to stop terminal spam
}, 60000)

async function makeRequest(url: string, creditCost = 1): Promise<any> {
  const cacheKey = url
  const now = Date.now()

  // Check cache first with longer duration
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`Using cached data for: ${url.split("?")[0]}`)
    return cache[cacheKey].data
  }

  // More conservative credit limit (6 per minute instead of 7)
  if (creditUsageThisMinute + creditCost > 5) {
    const timeUntilReset = 60000 - (now - lastCreditResetTime)
    if (timeUntilReset > 0) {
      console.log(`Credit limit approaching. Waiting ${timeUntilReset}ms before next request`)
      await delay(timeUntilReset)
      creditUsageThisMinute = 0
    }
  }

  // Implement rate limiting
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }

  lastRequestTime = Date.now()
  creditUsageThisMinute += creditCost
  console.log(`Making API request: ${url.split("?")[0]} (Credits used this minute: ${creditUsageThisMinute})`)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status === "error") {
      throw new Error(data.message || "API returned an error")
    }

    // Cache the successful response
    cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    }

    return data
  } catch (error) {
    console.error(`API request failed: ${error}`)
    throw error
  }
}

// Sample data for fallback when API is not available
const sampleStockData: Record<string, StockData[]> = {
  AAPL: [
    { date: "2024-01-01", price: 185.64, open: 184.50, high: 186.20, low: 183.80, volume: 45678900 },
    { date: "2024-01-02", price: 187.15, open: 185.64, high: 188.10, low: 185.20, volume: 52345600 },
    { date: "2024-01-03", price: 186.20, open: 187.15, high: 187.80, low: 185.90, volume: 49876500 },
    { date: "2024-01-04", price: 188.50, open: 186.20, high: 189.30, low: 186.00, volume: 51234500 },
    { date: "2024-01-05", price: 189.80, open: 188.50, high: 190.20, low: 188.10, volume: 48765400 },
    { date: "2024-01-06", price: 191.20, open: 189.80, high: 192.10, low: 189.50, volume: 53456700 },
    { date: "2024-01-07", price: 190.50, open: 191.20, high: 191.80, low: 189.90, volume: 45678900 },
    { date: "2024-01-08", price: 192.30, open: 190.50, high: 193.20, low: 190.20, volume: 56789000 },
    { date: "2024-01-09", price: 193.80, open: 192.30, high: 194.50, low: 192.00, volume: 59876500 },
    { date: "2024-01-10", price: 194.20, open: 193.80, high: 195.10, low: 193.50, volume: 52345600 },
    { date: "2024-01-11", price: 195.50, open: 194.20, high: 196.30, low: 194.00, volume: 54567800 },
    { date: "2024-01-12", price: 196.80, open: 195.50, high: 197.40, low: 195.20, volume: 56789000 },
    { date: "2024-01-13", price: 197.20, open: 196.80, high: 198.10, low: 196.50, volume: 52345600 },
    { date: "2024-01-14", price: 198.50, open: 197.20, high: 199.20, low: 197.00, volume: 58901200 },
    { date: "2024-01-15", price: 199.80, open: 198.50, high: 200.30, low: 198.30, volume: 61234500 },
    { date: "2024-01-16", price: 200.20, open: 199.80, high: 201.10, low: 199.60, volume: 53456700 },
    { date: "2024-01-17", price: 201.50, open: 200.20, high: 202.40, low: 200.00, volume: 57890100 },
    { date: "2024-01-18", price: 202.80, open: 201.50, high: 203.50, low: 201.30, volume: 60123400 },
    { date: "2024-01-19", price: 203.20, open: 202.80, high: 204.20, low: 202.60, volume: 54567800 },
    { date: "2024-01-20", price: 204.50, open: 203.20, high: 205.30, low: 203.00, volume: 62345600 },
    { date: "2024-01-21", price: 205.90, open: 204.50, high: 206.80, low: 204.20, volume: 63456700 },
    { date: "2024-01-22", price: 206.60, open: 205.90, high: 207.50, low: 205.70, volume: 64567800 },
    { date: "2024-01-23", price: 207.20, open: 206.60, high: 208.10, low: 206.40, volume: 65678900 },
    { date: "2024-01-24", price: 208.80, open: 207.20, high: 209.50, low: 207.00, volume: 66789000 },
    { date: "2024-01-25", price: 209.40, open: 208.80, high: 210.20, low: 208.60, volume: 67890100 },
    { date: "2024-01-26", price: 210.90, open: 209.40, high: 211.80, low: 209.20, volume: 68901200 },
    { date: "2024-01-27", price: 211.60, open: 210.90, high: 212.50, low: 210.70, volume: 69012300 },
    { date: "2024-01-28", price: 212.20, open: 211.60, high: 213.10, low: 211.40, volume: 70123400 },
    { date: "2024-01-29", price: 213.80, open: 212.20, high: 214.50, low: 212.00, volume: 71234500 },
    { date: "2024-01-30", price: 214.40, open: 213.80, high: 215.20, low: 213.60, volume: 72345600 },
    { date: "2024-01-31", price: 215.90, open: 214.40, high: 216.80, low: 214.20, volume: 73456700 },
    { date: "2024-02-01", price: 216.60, open: 215.90, high: 217.50, low: 215.70, volume: 74567800 },
    { date: "2024-02-02", price: 217.20, open: 216.60, high: 218.10, low: 216.40, volume: 75678900 },
    { date: "2024-02-03", price: 218.80, open: 217.20, high: 219.50, low: 217.00, volume: 76789000 },
    { date: "2024-02-04", price: 219.40, open: 218.80, high: 220.20, low: 218.60, volume: 77890100 },
    { date: "2024-02-05", price: 220.90, open: 219.40, high: 221.80, low: 219.20, volume: 78901200 },
    { date: "2024-02-06", price: 221.60, open: 220.90, high: 222.50, low: 220.70, volume: 79012300 },
    { date: "2024-02-07", price: 222.20, open: 221.60, high: 223.10, low: 221.40, volume: 80123400 },
    { date: "2024-02-08", price: 223.80, open: 222.20, high: 224.50, low: 222.00, volume: 81234500 },
    { date: "2024-02-09", price: 224.40, open: 223.80, high: 225.20, low: 223.60, volume: 82345600 },
    { date: "2024-02-10", price: 225.90, open: 224.40, high: 226.80, low: 224.20, volume: 83456700 },
    { date: "2024-02-11", price: 226.60, open: 225.90, high: 227.50, low: 225.70, volume: 84567800 },
    { date: "2024-02-12", price: 227.20, open: 226.60, high: 228.10, low: 226.40, volume: 85678900 },
    { date: "2024-02-13", price: 228.80, open: 227.20, high: 229.50, low: 227.00, volume: 86789000 },
    { date: "2024-02-14", price: 229.40, open: 228.80, high: 230.20, low: 228.60, volume: 87890100 },
    { date: "2024-02-15", price: 230.90, open: 229.40, high: 231.80, low: 229.20, volume: 88901200 },
    { date: "2024-02-16", price: 231.60, open: 230.90, high: 232.50, low: 230.70, volume: 89012300 },
    { date: "2024-02-17", price: 232.20, open: 231.60, high: 233.10, low: 231.40, volume: 90123400 },
    { date: "2024-02-18", price: 233.80, open: 232.20, high: 234.50, low: 232.00, volume: 91234500 },
    { date: "2024-02-19", price: 234.40, open: 233.80, high: 235.20, low: 233.60, volume: 92345600 },
    { date: "2024-02-20", price: 235.90, open: 234.40, high: 236.80, low: 234.20, volume: 93456700 },
    { date: "2024-02-21", price: 236.60, open: 235.90, high: 237.50, low: 235.70, volume: 94567800 },
    { date: "2024-02-22", price: 237.20, open: 236.60, high: 238.10, low: 236.40, volume: 95678900 },
    { date: "2024-02-23", price: 238.80, open: 237.20, high: 239.50, low: 237.00, volume: 96789000 },
    { date: "2024-02-24", price: 239.40, open: 238.80, high: 240.20, low: 238.60, volume: 97890100 },
    { date: "2024-02-25", price: 240.90, open: 239.40, high: 241.80, low: 239.20, volume: 98901200 },
    { date: "2024-02-26", price: 241.60, open: 240.90, high: 242.50, low: 240.70, volume: 99012300 },
    { date: "2024-02-27", price: 242.20, open: 241.60, high: 243.10, low: 241.40, volume: 100123400 },
    { date: "2024-02-28", price: 243.80, open: 242.20, high: 244.50, low: 242.00, volume: 101234500 },
    { date: "2024-02-29", price: 244.40, open: 243.80, high: 245.20, low: 243.60, volume: 102345600 },
    { date: "2024-03-01", price: 245.90, open: 244.40, high: 246.80, low: 244.20, volume: 103456700 },
    { date: "2024-03-02", price: 246.60, open: 245.90, high: 247.50, low: 245.70, volume: 104567800 },
    { date: "2024-03-03", price: 247.20, open: 246.60, high: 248.10, low: 246.40, volume: 105678900 },
    { date: "2024-03-04", price: 248.80, open: 247.20, high: 249.50, low: 247.00, volume: 106789000 },
    { date: "2024-03-05", price: 249.40, open: 248.80, high: 250.20, low: 248.60, volume: 107890100 },
    { date: "2024-03-06", price: 250.90, open: 249.40, high: 251.80, low: 249.20, volume: 108901200 },
    { date: "2024-03-07", price: 251.60, open: 250.90, high: 252.50, low: 250.70, volume: 109012300 },
    { date: "2024-03-08", price: 252.20, open: 251.60, high: 253.10, low: 251.40, volume: 110123400 },
    { date: "2024-03-09", price: 253.80, open: 252.20, high: 254.50, low: 252.00, volume: 111234500 },
    { date: "2024-03-10", price: 254.40, open: 253.80, high: 255.20, low: 253.60, volume: 112345600 },
  ],
  GOOGL: [
    { date: "2024-01-01", price: 140.50, open: 139.80, high: 141.20, low: 139.50, volume: 23456700 },
    { date: "2024-01-02", price: 141.80, open: 140.50, high: 142.50, low: 140.20, volume: 25678900 },
    { date: "2024-01-03", price: 142.30, open: 141.80, high: 143.10, low: 141.50, volume: 24567800 },
    { date: "2024-01-04", price: 143.90, open: 142.30, high: 144.50, low: 142.10, volume: 26789000 },
    { date: "2024-01-05", price: 144.20, open: 143.90, high: 145.10, low: 143.60, volume: 23456700 },
    { date: "2024-01-06", price: 145.80, open: 144.20, high: 146.30, low: 144.00, volume: 27890100 },
    { date: "2024-01-07", price: 146.50, open: 145.80, high: 147.20, low: 145.50, volume: 24567800 },
    { date: "2024-01-08", price: 147.90, open: 146.50, high: 148.50, low: 146.20, volume: 28901200 },
    { date: "2024-01-09", price: 148.30, open: 147.90, high: 149.10, low: 147.60, volume: 25678900 },
    { date: "2024-01-10", price: 149.80, open: 148.30, high: 150.20, low: 148.10, volume: 30123400 },
    { date: "2024-01-11", price: 150.50, open: 149.80, high: 151.30, low: 149.60, volume: 31234500 },
    { date: "2024-01-12", price: 151.80, open: 150.50, high: 152.40, low: 150.30, volume: 32345600 },
    { date: "2024-01-13", price: 152.30, open: 151.80, high: 153.10, low: 151.60, volume: 33456700 },
    { date: "2024-01-14", price: 153.90, open: 152.30, high: 154.50, low: 152.10, volume: 34567800 },
    { date: "2024-01-15", price: 154.20, open: 153.90, high: 155.10, low: 153.70, volume: 35678900 },
    { date: "2024-01-16", price: 155.80, open: 154.20, high: 156.30, low: 154.00, volume: 36789000 },
    { date: "2024-01-17", price: 156.50, open: 155.80, high: 157.20, low: 155.60, volume: 37890100 },
    { date: "2024-01-18", price: 157.90, open: 156.50, high: 158.50, low: 156.30, volume: 38901200 },
    { date: "2024-01-19", price: 158.30, open: 157.90, high: 159.10, low: 157.70, volume: 39012300 },
    { date: "2024-01-20", price: 159.80, open: 158.30, high: 160.20, low: 158.10, volume: 40123400 },
    { date: "2024-01-21", price: 160.50, open: 159.80, high: 161.30, low: 159.60, volume: 41234500 },
    { date: "2024-01-22", price: 161.80, open: 160.50, high: 162.40, low: 160.30, volume: 42345600 },
    { date: "2024-01-23", price: 162.30, open: 161.80, high: 163.10, low: 161.60, volume: 43456700 },
    { date: "2024-01-24", price: 163.90, open: 162.30, high: 164.50, low: 162.10, volume: 44567800 },
    { date: "2024-01-25", price: 164.20, open: 163.90, high: 165.10, low: 163.70, volume: 45678900 },
    { date: "2024-01-26", price: 165.80, open: 164.20, high: 166.30, low: 164.00, volume: 46789000 },
    { date: "2024-01-27", price: 166.50, open: 165.80, high: 167.20, low: 165.60, volume: 47890100 },
    { date: "2024-01-28", price: 167.90, open: 166.50, high: 168.50, low: 166.30, volume: 48901200 },
    { date: "2024-01-29", price: 168.30, open: 167.90, high: 169.10, low: 167.70, volume: 49012300 },
    { date: "2024-01-30", price: 169.80, open: 168.30, high: 170.20, low: 168.10, volume: 50123400 },
    { date: "2024-01-31", price: 170.50, open: 169.80, high: 171.30, low: 169.60, volume: 51234500 },
    { date: "2024-02-01", price: 171.80, open: 170.50, high: 172.40, low: 170.30, volume: 52345600 },
    { date: "2024-02-02", price: 172.30, open: 171.80, high: 173.10, low: 171.60, volume: 53456700 },
    { date: "2024-02-03", price: 173.90, open: 172.30, high: 174.50, low: 172.10, volume: 54567800 },
    { date: "2024-02-04", price: 174.20, open: 173.90, high: 175.10, low: 173.70, volume: 55678900 },
    { date: "2024-02-05", price: 175.80, open: 174.20, high: 176.30, low: 174.00, volume: 56789000 },
    { date: "2024-02-06", price: 176.50, open: 175.80, high: 177.20, low: 175.60, volume: 57890100 },
    { date: "2024-02-07", price: 177.90, open: 176.50, high: 178.50, low: 176.30, volume: 58901200 },
    { date: "2024-02-08", price: 178.30, open: 177.90, high: 179.10, low: 177.70, volume: 59012300 },
    { date: "2024-02-09", price: 179.80, open: 178.30, high: 180.20, low: 178.10, volume: 60123400 },
    { date: "2024-02-10", price: 180.50, open: 179.80, high: 181.30, low: 179.60, volume: 61234500 },
    { date: "2024-02-11", price: 181.80, open: 180.50, high: 182.40, low: 180.30, volume: 62345600 },
    { date: "2024-02-12", price: 182.30, open: 181.80, high: 183.10, low: 181.60, volume: 63456700 },
    { date: "2024-02-13", price: 183.90, open: 182.30, high: 184.50, low: 182.10, volume: 64567800 },
    { date: "2024-02-14", price: 184.20, open: 183.90, high: 185.10, low: 183.70, volume: 65678900 },
    { date: "2024-02-15", price: 185.80, open: 184.20, high: 186.30, low: 184.00, volume: 66789000 },
    { date: "2024-02-16", price: 186.50, open: 185.80, high: 187.20, low: 185.60, volume: 67890100 },
    { date: "2024-02-17", price: 187.90, open: 186.50, high: 188.50, low: 186.30, volume: 68901200 },
    { date: "2024-02-18", price: 188.30, open: 187.90, high: 189.10, low: 187.70, volume: 69012300 },
    { date: "2024-02-19", price: 189.80, open: 188.30, high: 190.20, low: 188.10, volume: 70123400 },
    { date: "2024-02-20", price: 190.50, open: 189.80, high: 191.30, low: 189.60, volume: 71234500 },
    { date: "2024-02-21", price: 191.80, open: 190.50, high: 192.40, low: 190.30, volume: 72345600 },
    { date: "2024-02-22", price: 192.30, open: 191.80, high: 193.10, low: 191.60, volume: 73456700 },
    { date: "2024-02-23", price: 193.90, open: 192.30, high: 194.50, low: 192.10, volume: 74567800 },
    { date: "2024-02-24", price: 194.20, open: 193.90, high: 195.10, low: 193.70, volume: 75678900 },
    { date: "2024-02-25", price: 195.80, open: 194.20, high: 196.30, low: 194.00, volume: 76789000 },
    { date: "2024-02-26", price: 196.50, open: 195.80, high: 197.20, low: 195.60, volume: 77890100 },
    { date: "2024-02-27", price: 197.90, open: 196.50, high: 198.50, low: 196.30, volume: 78901200 },
    { date: "2024-02-28", price: 198.30, open: 197.90, high: 199.10, low: 197.70, volume: 79012300 },
    { date: "2024-02-29", price: 199.80, open: 198.30, high: 200.20, low: 198.10, volume: 80123400 },
    { date: "2024-03-01", price: 200.50, open: 199.80, high: 201.30, low: 199.60, volume: 81234500 },
    { date: "2024-03-02", price: 201.80, open: 200.50, high: 202.40, low: 200.30, volume: 82345600 },
    { date: "2024-03-03", price: 202.30, open: 201.80, high: 203.10, low: 201.60, volume: 83456700 },
    { date: "2024-03-04", price: 203.90, open: 202.30, high: 204.50, low: 202.10, volume: 84567800 },
    { date: "2024-03-05", price: 204.20, open: 203.90, high: 205.10, low: 203.70, volume: 85678900 },
    { date: "2024-03-06", price: 205.80, open: 204.20, high: 206.30, low: 204.00, volume: 86789000 },
    { date: "2024-03-07", price: 206.50, open: 205.80, high: 207.20, low: 205.60, volume: 87890100 },
    { date: "2024-03-08", price: 207.90, open: 206.50, high: 208.50, low: 206.30, volume: 88901200 },
    { date: "2024-03-09", price: 208.30, open: 207.90, high: 209.10, low: 207.70, volume: 89012300 },
    { date: "2024-03-10", price: 209.80, open: 208.30, high: 210.20, low: 208.10, volume: 90123400 },
  ],
  MSFT: [
    { date: "2024-01-01", price: 375.20, open: 374.50, high: 376.80, low: 373.90, volume: 34567800 },
    { date: "2024-01-02", price: 376.80, open: 375.20, high: 378.50, low: 374.80, volume: 36789000 },
    { date: "2024-01-03", price: 377.50, open: 376.80, high: 379.20, low: 376.20, volume: 35678900 },
    { date: "2024-01-04", price: 378.90, open: 377.50, high: 380.10, low: 377.20, volume: 37890100 },
    { date: "2024-01-05", price: 379.60, open: 378.90, high: 381.30, low: 378.50, volume: 34567800 },
    { date: "2024-01-06", price: 381.20, open: 379.60, high: 382.50, low: 379.30, volume: 38901200 },
    { date: "2024-01-07", price: 382.80, open: 381.20, high: 383.90, low: 380.90, volume: 35678900 },
    { date: "2024-01-08", price: 383.50, open: 382.80, high: 385.20, low: 382.50, volume: 40123400 },
    { date: "2024-01-09", price: 384.90, open: 383.50, high: 386.10, low: 383.20, volume: 36789000 },
    { date: "2024-01-10", price: 386.30, open: 384.90, high: 387.50, low: 384.60, volume: 41234500 },
    { date: "2024-01-11", price: 387.80, open: 386.30, high: 388.90, low: 386.00, volume: 42345600 },
    { date: "2024-01-12", price: 388.50, open: 387.80, high: 389.60, low: 387.50, volume: 43456700 },
    { date: "2024-01-13", price: 389.20, open: 388.50, high: 390.30, low: 388.20, volume: 44567800 },
    { date: "2024-01-14", price: 390.80, open: 389.20, high: 391.50, low: 389.00, volume: 45678900 },
    { date: "2024-01-15", price: 391.40, open: 390.80, high: 392.20, low: 390.60, volume: 46789000 },
    { date: "2024-01-16", price: 392.90, open: 391.40, high: 393.80, low: 391.20, volume: 47890100 },
    { date: "2024-01-17", price: 393.60, open: 392.90, high: 394.50, low: 392.70, volume: 48901200 },
    { date: "2024-01-18", price: 394.20, open: 393.60, high: 395.10, low: 393.40, volume: 49012300 },
    { date: "2024-01-19", price: 395.80, open: 394.20, high: 396.50, low: 394.00, volume: 50123400 },
    { date: "2024-01-20", price: 396.40, open: 395.80, high: 397.20, low: 395.60, volume: 51234500 },
    { date: "2024-01-21", price: 397.90, open: 396.40, high: 398.80, low: 396.20, volume: 52345600 },
    { date: "2024-01-22", price: 398.60, open: 397.90, high: 399.50, low: 397.70, volume: 53456700 },
    { date: "2024-01-23", price: 399.20, open: 398.60, high: 400.10, low: 398.40, volume: 54567800 },
    { date: "2024-01-24", price: 400.80, open: 399.20, high: 401.50, low: 399.00, volume: 55678900 },
    { date: "2024-01-25", price: 401.40, open: 400.80, high: 402.20, low: 400.60, volume: 56789000 },
    { date: "2024-01-26", price: 402.90, open: 401.40, high: 403.80, low: 401.20, volume: 57890100 },
    { date: "2024-01-27", price: 403.60, open: 402.90, high: 404.50, low: 402.70, volume: 58901200 },
    { date: "2024-01-28", price: 404.20, open: 403.60, high: 405.10, low: 403.40, volume: 59012300 },
    { date: "2024-01-29", price: 405.80, open: 404.20, high: 406.50, low: 404.00, volume: 60123400 },
    { date: "2024-01-30", price: 406.40, open: 405.80, high: 407.20, low: 405.60, volume: 61234500 },
    { date: "2024-01-31", price: 407.90, open: 406.40, high: 408.80, low: 406.20, volume: 62345600 },
    { date: "2024-02-01", price: 408.60, open: 407.90, high: 409.50, low: 407.70, volume: 63456700 },
    { date: "2024-02-02", price: 409.20, open: 408.60, high: 410.10, low: 408.40, volume: 64567800 },
    { date: "2024-02-03", price: 410.80, open: 409.20, high: 411.50, low: 409.00, volume: 65678900 },
    { date: "2024-02-04", price: 411.40, open: 410.80, high: 412.20, low: 410.60, volume: 66789000 },
    { date: "2024-02-05", price: 412.90, open: 411.40, high: 413.80, low: 411.20, volume: 67890100 },
    { date: "2024-02-06", price: 413.60, open: 412.90, high: 414.50, low: 412.70, volume: 68901200 },
    { date: "2024-02-07", price: 414.20, open: 413.60, high: 415.10, low: 413.40, volume: 69012300 },
    { date: "2024-02-08", price: 415.80, open: 414.20, high: 416.50, low: 414.00, volume: 70123400 },
    { date: "2024-02-09", price: 416.40, open: 415.80, high: 417.20, low: 415.60, volume: 71234500 },
    { date: "2024-02-10", price: 417.90, open: 416.40, high: 418.80, low: 416.20, volume: 72345600 },
    { date: "2024-02-11", price: 418.60, open: 417.90, high: 419.50, low: 417.70, volume: 73456700 },
    { date: "2024-02-12", price: 419.20, open: 418.60, high: 420.10, low: 418.40, volume: 74567800 },
    { date: "2024-02-13", price: 420.80, open: 419.20, high: 421.50, low: 419.00, volume: 75678900 },
    { date: "2024-02-14", price: 421.40, open: 420.80, high: 422.20, low: 420.60, volume: 76789000 },
    { date: "2024-02-15", price: 422.90, open: 421.40, high: 423.80, low: 421.20, volume: 77890100 },
    { date: "2024-02-16", price: 423.60, open: 422.90, high: 424.50, low: 422.70, volume: 78901200 },
    { date: "2024-02-17", price: 424.20, open: 423.60, high: 425.10, low: 423.40, volume: 79012300 },
    { date: "2024-02-18", price: 425.80, open: 424.20, high: 426.50, low: 424.00, volume: 80123400 },
    { date: "2024-02-19", price: 426.40, open: 425.80, high: 427.20, low: 425.60, volume: 81234500 },
    { date: "2024-02-20", price: 427.90, open: 426.40, high: 428.80, low: 426.20, volume: 82345600 },
    { date: "2024-02-21", price: 428.60, open: 427.90, high: 429.50, low: 427.70, volume: 83456700 },
    { date: "2024-02-22", price: 429.20, open: 428.60, high: 430.10, low: 428.40, volume: 84567800 },
    { date: "2024-02-23", price: 430.80, open: 429.20, high: 431.50, low: 429.00, volume: 85678900 },
    { date: "2024-02-24", price: 431.40, open: 430.80, high: 432.20, low: 430.60, volume: 86789000 },
    { date: "2024-02-25", price: 432.90, open: 431.40, high: 433.80, low: 431.20, volume: 87890100 },
    { date: "2024-02-26", price: 433.60, open: 432.90, high: 434.50, low: 432.70, volume: 88901200 },
    { date: "2024-02-27", price: 434.20, open: 433.60, high: 435.10, low: 433.40, volume: 89012300 },
    { date: "2024-02-28", price: 435.80, open: 434.20, high: 436.50, low: 434.00, volume: 90123400 },
    { date: "2024-02-29", price: 436.40, open: 435.80, high: 437.20, low: 435.60, volume: 91234500 },
    { date: "2024-03-01", price: 437.90, open: 436.40, high: 438.80, low: 436.20, volume: 92345600 },
    { date: "2024-03-02", price: 438.60, open: 437.90, high: 439.50, low: 437.70, volume: 93456700 },
    { date: "2024-03-03", price: 439.20, open: 438.60, high: 440.10, low: 438.40, volume: 94567800 },
    { date: "2024-03-04", price: 440.80, open: 439.20, high: 441.50, low: 439.00, volume: 95678900 },
    { date: "2024-03-05", price: 441.40, open: 440.80, high: 442.20, low: 440.60, volume: 96789000 },
    { date: "2024-03-06", price: 442.90, open: 441.40, high: 443.80, low: 441.20, volume: 97890100 },
    { date: "2024-03-07", price: 443.60, open: 442.90, high: 444.50, low: 442.70, volume: 98901200 },
    { date: "2024-03-08", price: 444.20, open: 443.60, high: 445.10, low: 443.40, volume: 99012300 },
    { date: "2024-03-09", price: 445.80, open: 444.20, high: 446.50, low: 444.00, volume: 100123400 },
    { date: "2024-03-10", price: 446.40, open: 445.80, high: 447.20, low: 445.60, volume: 101234500 },
  ],
  TSLA: [
    { date: "2024-01-01", price: 248.50, open: 247.80, high: 250.20, low: 247.20, volume: 45678900 },
    { date: "2024-01-02", price: 250.80, open: 248.50, high: 252.10, low: 248.30, volume: 47890100 },
    { date: "2024-01-03", price: 251.30, open: 250.80, high: 253.50, low: 250.50, volume: 46789000 },
    { date: "2024-01-04", price: 252.90, open: 251.30, high: 254.80, low: 251.10, volume: 48901200 },
    { date: "2024-01-05", price: 253.60, open: 252.90, high: 255.30, low: 252.50, volume: 45678900 },
    { date: "2024-01-06", price: 255.20, open: 253.60, high: 256.80, low: 253.30, volume: 50123400 },
    { date: "2024-01-07", price: 256.80, open: 255.20, high: 258.10, low: 255.00, volume: 46789000 },
    { date: "2024-01-08", price: 257.50, open: 256.80, high: 259.50, low: 256.60, volume: 52345600 },
    { date: "2024-01-09", price: 258.90, open: 257.50, high: 260.20, low: 257.30, volume: 47890100 },
    { date: "2024-01-10", price: 260.30, open: 258.90, high: 261.80, low: 258.70, volume: 53456700 },
    { date: "2024-01-11", price: 261.80, open: 260.30, high: 263.20, low: 260.10, volume: 54567800 },
    { date: "2024-01-12", price: 263.50, open: 261.80, high: 265.10, low: 261.60, volume: 56789000 },
    { date: "2024-01-13", price: 264.20, open: 263.50, high: 266.30, low: 263.30, volume: 57890100 },
    { date: "2024-01-14", price: 266.80, open: 264.20, high: 268.50, low: 264.00, volume: 58901200 },
    { date: "2024-01-15", price: 267.50, open: 266.80, high: 269.20, low: 266.60, volume: 59012300 },
    { date: "2024-01-16", price: 269.20, open: 267.50, high: 271.10, low: 267.30, volume: 60123400 },
    { date: "2024-01-17", price: 270.80, open: 269.20, high: 272.50, low: 269.00, volume: 61234500 },
    { date: "2024-01-18", price: 272.50, open: 270.80, high: 274.20, low: 270.60, volume: 62345600 },
    { date: "2024-01-19", price: 273.20, open: 272.50, high: 275.30, low: 272.30, volume: 63456700 },
    { date: "2024-01-20", price: 275.80, open: 273.20, high: 277.50, low: 273.00, volume: 64567800 },
    { date: "2024-01-21", price: 276.50, open: 275.80, high: 278.20, low: 275.60, volume: 65678900 },
    { date: "2024-01-22", price: 278.20, open: 276.50, high: 280.10, low: 276.30, volume: 66789000 },
    { date: "2024-01-23", price: 279.80, open: 278.20, high: 281.50, low: 278.00, volume: 67890100 },
    { date: "2024-01-24", price: 281.50, open: 279.80, high: 283.20, low: 279.60, volume: 68901200 },
    { date: "2024-01-25", price: 282.20, open: 281.50, high: 284.30, low: 281.30, volume: 69012300 },
    { date: "2024-01-26", price: 284.80, open: 282.20, high: 286.50, low: 282.00, volume: 70123400 },
    { date: "2024-01-27", price: 285.50, open: 284.80, high: 287.20, low: 284.60, volume: 71234500 },
    { date: "2024-01-28", price: 287.20, open: 285.50, high: 289.10, low: 285.30, volume: 72345600 },
    { date: "2024-01-29", price: 288.80, open: 287.20, high: 290.50, low: 287.00, volume: 73456700 },
    { date: "2024-01-30", price: 290.50, open: 288.80, high: 292.20, low: 288.60, volume: 74567800 },
    { date: "2024-01-31", price: 291.20, open: 290.50, high: 293.30, low: 290.30, volume: 75678900 },
    { date: "2024-02-01", price: 293.80, open: 291.20, high: 295.50, low: 291.00, volume: 76789000 },
    { date: "2024-02-02", price: 294.50, open: 293.80, high: 296.20, low: 293.60, volume: 77890100 },
    { date: "2024-02-03", price: 296.20, open: 294.50, high: 298.10, low: 294.30, volume: 78901200 },
    { date: "2024-02-04", price: 297.80, open: 296.20, high: 299.50, low: 296.00, volume: 79012300 },
    { date: "2024-02-05", price: 299.50, open: 297.80, high: 301.20, low: 297.60, volume: 80123400 },
    { date: "2024-02-06", price: 300.20, open: 299.50, high: 302.30, low: 299.30, volume: 81234500 },
    { date: "2024-02-07", price: 302.80, open: 300.20, high: 304.50, low: 300.00, volume: 82345600 },
    { date: "2024-02-08", price: 303.50, open: 302.80, high: 305.20, low: 302.60, volume: 83456700 },
    { date: "2024-02-09", price: 305.20, open: 303.50, high: 307.10, low: 303.30, volume: 84567800 },
    { date: "2024-02-10", price: 306.80, open: 305.20, high: 308.50, low: 305.00, volume: 85678900 },
    { date: "2024-02-11", price: 308.50, open: 306.80, high: 310.20, low: 306.60, volume: 86789000 },
    { date: "2024-02-12", price: 309.20, open: 308.50, high: 311.30, low: 308.30, volume: 87890100 },
    { date: "2024-02-13", price: 311.80, open: 309.20, high: 313.50, low: 309.00, volume: 88901200 },
    { date: "2024-02-14", price: 312.50, open: 311.80, high: 314.20, low: 311.60, volume: 89012300 },
    { date: "2024-02-15", price: 314.20, open: 312.50, high: 316.10, low: 312.30, volume: 90123400 },
    { date: "2024-02-16", price: 315.80, open: 314.20, high: 317.50, low: 314.00, volume: 91234500 },
    { date: "2024-02-17", price: 317.50, open: 315.80, high: 319.20, low: 315.60, volume: 92345600 },
    { date: "2024-02-18", price: 318.20, open: 317.50, high: 320.30, low: 317.30, volume: 93456700 },
    { date: "2024-02-19", price: 320.80, open: 318.20, high: 322.50, low: 318.00, volume: 94567800 },
    { date: "2024-02-20", price: 321.50, open: 320.80, high: 323.20, low: 320.60, volume: 95678900 },
    { date: "2024-02-21", price: 323.20, open: 321.50, high: 325.10, low: 321.30, volume: 96789000 },
    { date: "2024-02-22", price: 324.80, open: 323.20, high: 326.50, low: 323.00, volume: 97890100 },
    { date: "2024-02-23", price: 326.50, open: 324.80, high: 328.20, low: 324.60, volume: 98901200 },
    { date: "2024-02-24", price: 327.20, open: 326.50, high: 329.30, low: 326.30, volume: 99012300 },
    { date: "2024-02-25", price: 329.80, open: 327.20, high: 331.50, low: 327.00, volume: 100123400 },
    { date: "2024-02-26", price: 330.50, open: 329.80, high: 332.20, low: 329.60, volume: 101234500 },
    { date: "2024-02-27", price: 332.20, open: 330.50, high: 334.10, low: 330.30, volume: 102345600 },
    { date: "2024-02-28", price: 333.80, open: 332.20, high: 335.50, low: 332.00, volume: 103456700 },
    { date: "2024-02-29", price: 335.50, open: 333.80, high: 337.20, low: 333.60, volume: 104567800 },
    { date: "2024-03-01", price: 336.20, open: 335.50, high: 338.30, low: 335.30, volume: 105678900 },
    { date: "2024-03-02", price: 338.80, open: 336.20, high: 340.50, low: 336.00, volume: 106789000 },
    { date: "2024-03-03", price: 339.50, open: 338.80, high: 341.20, low: 338.60, volume: 107890100 },
    { date: "2024-03-04", price: 341.20, open: 339.50, high: 343.10, low: 339.30, volume: 108901200 },
    { date: "2024-03-05", price: 342.80, open: 341.20, high: 344.50, low: 341.00, volume: 109012300 },
    { date: "2024-03-06", price: 344.50, open: 342.80, high: 346.20, low: 342.60, volume: 110123400 },
    { date: "2024-03-07", price: 345.20, open: 344.50, high: 347.30, low: 344.30, volume: 111234500 },
    { date: "2024-03-08", price: 347.80, open: 345.20, high: 349.50, low: 345.00, volume: 112345600 },
    { date: "2024-03-09", price: 348.50, open: 347.80, high: 350.20, low: 347.60, volume: 113456700 },
    { date: "2024-03-10", price: 350.20, open: 348.50, high: 352.10, low: 348.30, volume: 114567800 },
  ],
  AMZN: [
    { date: "2024-01-01", price: 151.20, open: 150.80, high: 152.50, low: 150.50, volume: 34567800 },
    { date: "2024-01-02", price: 152.80, open: 151.20, high: 153.90, low: 151.00, volume: 36789000 },
    { date: "2024-01-03", price: 153.30, open: 152.80, high: 154.60, low: 152.50, volume: 35678900 },
    { date: "2024-01-04", price: 154.90, open: 153.30, high: 155.80, low: 153.10, volume: 37890100 },
    { date: "2024-01-05", price: 155.60, open: 154.90, high: 156.70, low: 154.60, volume: 34567800 },
    { date: "2024-01-06", price: 156.20, open: 155.60, high: 157.50, low: 155.30, volume: 38901200 },
    { date: "2024-01-07", price: 157.80, open: 156.20, high: 158.90, low: 156.00, volume: 35678900 },
    { date: "2024-01-08", price: 158.50, open: 157.80, high: 159.80, low: 157.60, volume: 40123400 },
    { date: "2024-01-09", price: 159.90, open: 158.50, high: 160.70, low: 158.30, volume: 36789000 },
    { date: "2024-01-10", price: 160.30, open: 159.90, high: 161.50, low: 159.70, volume: 41234500 },
    { date: "2024-01-11", price: 161.80, open: 160.30, high: 162.90, low: 160.10, volume: 42345600 },
    { date: "2024-01-12", price: 162.50, open: 161.80, high: 163.70, low: 161.60, volume: 43456700 },
    { date: "2024-01-13", price: 163.90, open: 162.50, high: 164.80, low: 162.30, volume: 44567800 },
    { date: "2024-01-14", price: 164.60, open: 163.90, high: 165.70, low: 163.70, volume: 45678900 },
    { date: "2024-01-15", price: 165.20, open: 164.60, high: 166.50, low: 164.30, volume: 46789000 },
    { date: "2024-01-16", price: 166.80, open: 165.20, high: 167.90, low: 165.00, volume: 47890100 },
    { date: "2024-01-17", price: 167.50, open: 166.80, high: 168.80, low: 166.60, volume: 48901200 },
    { date: "2024-01-18", price: 168.90, open: 167.50, high: 169.70, low: 167.30, volume: 49012300 },
    { date: "2024-01-19", price: 169.60, open: 168.90, high: 170.70, low: 168.70, volume: 50123400 },
    { date: "2024-01-20", price: 170.20, open: 169.60, high: 171.50, low: 169.30, volume: 51234500 },
    { date: "2024-01-21", price: 171.80, open: 170.20, high: 172.90, low: 170.00, volume: 52345600 },
    { date: "2024-01-22", price: 172.50, open: 171.80, high: 173.80, low: 171.60, volume: 53456700 },
    { date: "2024-01-23", price: 173.90, open: 172.50, high: 174.70, low: 172.30, volume: 54567800 },
    { date: "2024-01-24", price: 174.60, open: 173.90, high: 175.70, low: 173.70, volume: 55678900 },
    { date: "2024-01-25", price: 175.20, open: 174.60, high: 176.50, low: 174.30, volume: 56789000 },
    { date: "2024-01-26", price: 176.80, open: 175.20, high: 177.90, low: 175.00, volume: 57890100 },
    { date: "2024-01-27", price: 177.50, open: 176.80, high: 178.80, low: 176.60, volume: 58901200 },
    { date: "2024-01-28", price: 178.90, open: 177.50, high: 179.70, low: 177.30, volume: 59012300 },
    { date: "2024-01-29", price: 179.60, open: 178.90, high: 180.70, low: 178.70, volume: 60123400 },
    { date: "2024-01-30", price: 180.20, open: 179.60, high: 181.50, low: 179.30, volume: 61234500 },
    { date: "2024-01-31", price: 181.80, open: 180.20, high: 182.90, low: 180.00, volume: 62345600 },
    { date: "2024-02-01", price: 182.50, open: 181.80, high: 183.80, low: 181.60, volume: 63456700 },
    { date: "2024-02-02", price: 183.90, open: 182.50, high: 184.70, low: 182.30, volume: 64567800 },
    { date: "2024-02-03", price: 184.60, open: 183.90, high: 185.70, low: 183.70, volume: 65678900 },
    { date: "2024-02-04", price: 185.20, open: 184.60, high: 186.50, low: 184.30, volume: 66789000 },
    { date: "2024-02-05", price: 186.80, open: 185.20, high: 187.90, low: 185.00, volume: 67890100 },
    { date: "2024-02-06", price: 187.50, open: 186.80, high: 188.80, low: 186.60, volume: 68901200 },
    { date: "2024-02-07", price: 188.90, open: 187.50, high: 189.70, low: 187.30, volume: 69012300 },
    { date: "2024-02-08", price: 189.60, open: 188.90, high: 190.70, low: 188.70, volume: 70123400 },
    { date: "2024-02-09", price: 190.20, open: 189.60, high: 191.50, low: 189.30, volume: 71234500 },
    { date: "2024-02-10", price: 191.80, open: 190.20, high: 192.90, low: 190.00, volume: 72345600 },
    { date: "2024-02-11", price: 192.50, open: 191.80, high: 193.80, low: 191.60, volume: 73456700 },
    { date: "2024-02-12", price: 193.90, open: 192.50, high: 194.70, low: 192.30, volume: 74567800 },
    { date: "2024-02-13", price: 194.60, open: 193.90, high: 195.70, low: 193.70, volume: 75678900 },
    { date: "2024-02-14", price: 195.20, open: 194.60, high: 196.50, low: 194.30, volume: 76789000 },
    { date: "2024-02-15", price: 196.80, open: 195.20, high: 197.90, low: 195.00, volume: 77890100 },
    { date: "2024-02-16", price: 197.50, open: 196.80, high: 198.80, low: 196.60, volume: 78901200 },
    { date: "2024-02-17", price: 198.90, open: 197.50, high: 199.70, low: 197.30, volume: 79012300 },
    { date: "2024-02-18", price: 199.60, open: 198.90, high: 200.70, low: 198.70, volume: 80123400 },
    { date: "2024-02-19", price: 200.20, open: 199.60, high: 201.50, low: 199.30, volume: 81234500 },
    { date: "2024-02-20", price: 201.80, open: 200.20, high: 202.90, low: 200.00, volume: 82345600 },
    { date: "2024-02-21", price: 202.50, open: 201.80, high: 203.80, low: 201.60, volume: 83456700 },
    { date: "2024-02-22", price: 203.90, open: 202.50, high: 204.70, low: 202.30, volume: 84567800 },
    { date: "2024-02-23", price: 204.60, open: 203.90, high: 205.70, low: 203.70, volume: 85678900 },
    { date: "2024-02-24", price: 205.20, open: 204.60, high: 206.50, low: 204.30, volume: 86789000 },
    { date: "2024-02-25", price: 206.80, open: 205.20, high: 207.90, low: 205.00, volume: 87890100 },
    { date: "2024-02-26", price: 207.50, open: 206.80, high: 208.80, low: 206.60, volume: 88901200 },
    { date: "2024-02-27", price: 208.90, open: 207.50, high: 209.70, low: 207.30, volume: 89012300 },
    { date: "2024-02-28", price: 209.60, open: 208.90, high: 210.70, low: 208.70, volume: 90123400 },
    { date: "2024-02-29", price: 210.20, open: 209.60, high: 211.50, low: 209.30, volume: 91234500 },
    { date: "2024-03-01", price: 211.80, open: 210.20, high: 212.90, low: 210.00, volume: 92345600 },
    { date: "2024-03-02", price: 212.50, open: 211.80, high: 213.80, low: 211.60, volume: 93456700 },
    { date: "2024-03-03", price: 213.90, open: 212.50, high: 214.70, low: 212.30, volume: 94567800 },
    { date: "2024-03-04", price: 214.60, open: 213.90, high: 215.70, low: 213.70, volume: 95678900 },
    { date: "2024-03-05", price: 215.20, open: 214.60, high: 216.50, low: 214.30, volume: 96789000 },
    { date: "2024-03-06", price: 216.80, open: 215.20, high: 217.90, low: 215.00, volume: 97890100 },
    { date: "2024-03-07", price: 217.50, open: 216.80, high: 218.80, low: 216.60, volume: 98901200 },
    { date: "2024-03-08", price: 218.90, open: 217.50, high: 219.70, low: 217.30, volume: 99012300 },
    { date: "2024-03-09", price: 219.60, open: 218.90, high: 220.70, low: 218.70, volume: 100123400 },
    { date: "2024-03-10", price: 220.20, open: 219.60, high: 221.50, low: 219.30, volume: 101234500 },
  ],
  META: [
    { date: "2024-01-01", price: 380.50, open: 379.80, high: 382.20, low: 379.20, volume: 23456700 },
    { date: "2024-01-02", price: 382.80, open: 380.50, high: 384.10, low: 380.30, volume: 25678900 },
    { date: "2024-01-03", price: 383.30, open: 382.80, high: 385.50, low: 382.50, volume: 24567800 },
    { date: "2024-01-04", price: 384.90, open: 383.30, high: 386.80, low: 383.10, volume: 26789000 },
    { date: "2024-01-05", price: 385.60, open: 384.90, high: 387.70, low: 384.60, volume: 23456700 },
    { date: "2024-01-06", price: 386.20, open: 385.60, high: 388.50, low: 385.30, volume: 27890100 },
    { date: "2024-01-07", price: 387.80, open: 386.20, high: 389.90, low: 386.00, volume: 24567800 },
    { date: "2024-01-08", price: 388.50, open: 387.80, high: 390.80, low: 387.60, volume: 30123400 },
    { date: "2024-01-09", price: 389.90, open: 388.50, high: 391.70, low: 388.30, volume: 25678900 },
    { date: "2024-01-10", price: 390.30, open: 389.90, high: 392.50, low: 389.70, volume: 31234500 },
    { date: "2024-01-11", price: 391.80, open: 390.30, high: 393.20, low: 390.10, volume: 32345600 },
    { date: "2024-01-12", price: 392.50, open: 391.80, high: 394.40, low: 391.60, volume: 33456700 },
    { date: "2024-01-13", price: 393.90, open: 392.50, high: 395.80, low: 392.30, volume: 34567800 },
    { date: "2024-01-14", price: 394.60, open: 393.90, high: 396.70, low: 393.70, volume: 35678900 },
    { date: "2024-01-15", price: 395.20, open: 394.60, high: 397.50, low: 394.30, volume: 36789000 },
    { date: "2024-01-16", price: 396.80, open: 395.20, high: 398.90, low: 395.00, volume: 37890100 },
    { date: "2024-01-17", price: 397.50, open: 396.80, high: 399.80, low: 396.60, volume: 38901200 },
    { date: "2024-01-18", price: 398.90, open: 397.50, high: 400.70, low: 397.30, volume: 39012300 },
    { date: "2024-01-19", price: 399.60, open: 398.90, high: 401.70, low: 398.70, volume: 40123400 },
    { date: "2024-01-20", price: 400.20, open: 399.60, high: 402.50, low: 399.30, volume: 41234500 },
    { date: "2024-01-21", price: 401.80, open: 400.20, high: 403.90, low: 400.00, volume: 42345600 },
    { date: "2024-01-22", price: 402.50, open: 401.80, high: 404.80, low: 401.60, volume: 43456700 },
    { date: "2024-01-23", price: 403.90, open: 402.50, high: 405.70, low: 402.30, volume: 44567800 },
    { date: "2024-01-24", price: 404.60, open: 403.90, high: 406.70, low: 403.70, volume: 45678900 },
    { date: "2024-01-25", price: 405.20, open: 404.60, high: 407.50, low: 404.30, volume: 46789000 },
    { date: "2024-01-26", price: 406.80, open: 405.20, high: 408.90, low: 405.00, volume: 47890100 },
    { date: "2024-01-27", price: 407.50, open: 406.80, high: 409.80, low: 406.60, volume: 48901200 },
    { date: "2024-01-28", price: 408.90, open: 407.50, high: 410.70, low: 407.30, volume: 49012300 },
    { date: "2024-01-29", price: 409.60, open: 408.90, high: 411.70, low: 408.70, volume: 50123400 },
    { date: "2024-01-30", price: 410.20, open: 409.60, high: 412.50, low: 409.30, volume: 51234500 },
    { date: "2024-01-31", price: 411.80, open: 410.20, high: 413.90, low: 410.00, volume: 52345600 },
    { date: "2024-02-01", price: 412.50, open: 411.80, high: 414.80, low: 411.60, volume: 53456700 },
    { date: "2024-02-02", price: 413.90, open: 412.50, high: 415.70, low: 412.30, volume: 54567800 },
    { date: "2024-02-03", price: 414.60, open: 413.90, high: 416.70, low: 413.70, volume: 55678900 },
    { date: "2024-02-04", price: 415.20, open: 414.60, high: 417.50, low: 414.30, volume: 56789000 },
    { date: "2024-02-05", price: 416.80, open: 415.20, high: 418.90, low: 415.00, volume: 57890100 },
    { date: "2024-02-06", price: 417.50, open: 416.80, high: 419.80, low: 416.60, volume: 58901200 },
    { date: "2024-02-07", price: 418.90, open: 417.50, high: 420.70, low: 417.30, volume: 59012300 },
    { date: "2024-02-08", price: 419.60, open: 418.90, high: 421.70, low: 418.70, volume: 60123400 },
    { date: "2024-02-09", price: 420.20, open: 419.60, high: 422.50, low: 419.30, volume: 61234500 },
    { date: "2024-02-10", price: 421.80, open: 420.20, high: 423.90, low: 420.00, volume: 62345600 },
    { date: "2024-02-11", price: 422.50, open: 421.80, high: 424.80, low: 421.60, volume: 63456700 },
    { date: "2024-02-12", price: 423.90, open: 422.50, high: 425.70, low: 422.30, volume: 64567800 },
    { date: "2024-02-13", price: 424.60, open: 423.90, high: 426.70, low: 423.70, volume: 65678900 },
    { date: "2024-02-14", price: 425.20, open: 424.60, high: 427.50, low: 424.30, volume: 66789000 },
    { date: "2024-02-15", price: 426.80, open: 425.20, high: 428.90, low: 425.00, volume: 67890100 },
    { date: "2024-02-16", price: 427.50, open: 426.80, high: 429.80, low: 426.60, volume: 68901200 },
    { date: "2024-02-17", price: 428.90, open: 427.50, high: 430.70, low: 427.30, volume: 69012300 },
    { date: "2024-02-18", price: 429.60, open: 428.90, high: 431.70, low: 428.70, volume: 70123400 },
    { date: "2024-02-19", price: 430.20, open: 429.60, high: 432.50, low: 429.30, volume: 71234500 },
    { date: "2024-02-20", price: 431.80, open: 430.20, high: 433.90, low: 430.00, volume: 72345600 },
    { date: "2024-02-21", price: 432.50, open: 431.80, high: 434.80, low: 431.60, volume: 73456700 },
    { date: "2024-02-22", price: 433.90, open: 432.50, high: 435.70, low: 432.30, volume: 74567800 },
    { date: "2024-02-23", price: 434.60, open: 433.90, high: 436.70, low: 433.70, volume: 75678900 },
    { date: "2024-02-24", price: 435.20, open: 434.60, high: 437.50, low: 434.30, volume: 76789000 },
    { date: "2024-02-25", price: 436.80, open: 435.20, high: 438.90, low: 435.00, volume: 77890100 },
    { date: "2024-02-26", price: 437.50, open: 436.80, high: 439.80, low: 436.60, volume: 78901200 },
    { date: "2024-02-27", price: 438.90, open: 437.50, high: 440.70, low: 437.30, volume: 79012300 },
    { date: "2024-02-28", price: 439.60, open: 438.90, high: 441.70, low: 438.70, volume: 80123400 },
    { date: "2024-02-29", price: 440.20, open: 439.60, high: 442.50, low: 439.30, volume: 81234500 },
    { date: "2024-03-01", price: 441.80, open: 440.20, high: 443.90, low: 440.00, volume: 82345600 },
    { date: "2024-03-02", price: 442.50, open: 441.80, high: 444.80, low: 441.60, volume: 83456700 },
    { date: "2024-03-03", price: 443.90, open: 442.50, high: 445.70, low: 442.30, volume: 84567800 },
    { date: "2024-03-04", price: 444.60, open: 443.90, high: 446.70, low: 443.70, volume: 85678900 },
    { date: "2024-03-05", price: 445.20, open: 444.60, high: 447.50, low: 444.30, volume: 86789000 },
    { date: "2024-03-06", price: 446.80, open: 445.20, high: 448.90, low: 445.00, volume: 87890100 },
    { date: "2024-03-07", price: 447.50, open: 446.80, high: 449.80, low: 446.60, volume: 88901200 },
    { date: "2024-03-08", price: 448.90, open: 447.50, high: 450.70, low: 447.30, volume: 89012300 },
    { date: "2024-03-09", price: 449.60, open: 448.90, high: 451.70, low: 448.70, volume: 90123400 },
    { date: "2024-03-10", price: 450.20, open: 449.60, high: 452.50, low: 449.30, volume: 91234500 },
  ],
  NVDA: [
    { date: "2024-01-01", price: 485.50, open: 484.80, high: 487.20, low: 484.20, volume: 34567800 },
    { date: "2024-01-02", price: 487.80, open: 485.50, high: 489.10, low: 485.30, volume: 36789000 },
    { date: "2024-01-03", price: 488.30, open: 487.80, high: 490.50, low: 487.50, volume: 35678900 },
    { date: "2024-01-04", price: 489.90, open: 488.30, high: 491.80, low: 488.10, volume: 37890100 },
    { date: "2024-01-05", price: 490.60, open: 489.90, high: 492.70, low: 489.60, volume: 34567800 },
    { date: "2024-01-06", price: 491.20, open: 490.60, high: 493.50, low: 490.30, volume: 38901200 },
    { date: "2024-01-07", price: 492.80, open: 491.20, high: 494.90, low: 491.00, volume: 35678900 },
    { date: "2024-01-08", price: 493.50, open: 492.80, high: 495.80, low: 492.60, volume: 40123400 },
    { date: "2024-01-09", price: 494.90, open: 493.50, high: 496.70, low: 493.30, volume: 36789000 },
    { date: "2024-01-10", price: 495.30, open: 494.90, high: 497.50, low: 494.70, volume: 41234500 },
    { date: "2024-01-11", price: 496.80, open: 495.30, high: 498.20, low: 495.10, volume: 42345600 },
    { date: "2024-01-12", price: 497.50, open: 496.80, high: 499.40, low: 496.60, volume: 43456700 },
    { date: "2024-01-13", price: 498.90, open: 497.50, high: 500.80, low: 497.30, volume: 44567800 },
    { date: "2024-01-14", price: 499.60, open: 498.90, high: 501.70, low: 498.70, volume: 45678900 },
    { date: "2024-01-15", price: 500.20, open: 499.60, high: 502.50, low: 499.30, volume: 46789000 },
    { date: "2024-01-16", price: 501.80, open: 500.20, high: 503.90, low: 500.00, volume: 47890100 },
    { date: "2024-01-17", price: 502.50, open: 501.80, high: 504.80, low: 501.60, volume: 48901200 },
    { date: "2024-01-18", price: 503.90, open: 502.50, high: 505.70, low: 502.30, volume: 49012300 },
    { date: "2024-01-19", price: 504.60, open: 503.90, high: 506.70, low: 503.70, volume: 50123400 },
    { date: "2024-01-20", price: 505.20, open: 504.60, high: 507.50, low: 504.30, volume: 51234500 },
    { date: "2024-01-21", price: 506.80, open: 505.20, high: 508.90, low: 505.00, volume: 52345600 },
    { date: "2024-01-22", price: 507.50, open: 506.80, high: 509.80, low: 506.60, volume: 53456700 },
    { date: "2024-01-23", price: 508.90, open: 507.50, high: 510.70, low: 507.30, volume: 54567800 },
    { date: "2024-01-24", price: 509.60, open: 508.90, high: 511.70, low: 508.70, volume: 55678900 },
    { date: "2024-01-25", price: 510.20, open: 509.60, high: 512.50, low: 509.30, volume: 56789000 },
    { date: "2024-01-26", price: 511.80, open: 510.20, high: 513.90, low: 510.00, volume: 57890100 },
    { date: "2024-01-27", price: 512.50, open: 511.80, high: 514.80, low: 511.60, volume: 58901200 },
    { date: "2024-01-28", price: 513.90, open: 512.50, high: 515.70, low: 512.30, volume: 59012300 },
    { date: "2024-01-29", price: 514.60, open: 513.90, high: 516.70, low: 513.70, volume: 60123400 },
    { date: "2024-01-30", price: 515.20, open: 514.60, high: 517.50, low: 514.30, volume: 61234500 },
    { date: "2024-01-31", price: 516.80, open: 515.20, high: 518.90, low: 515.00, volume: 62345600 },
    { date: "2024-02-01", price: 517.50, open: 516.80, high: 519.80, low: 516.60, volume: 63456700 },
    { date: "2024-02-02", price: 518.90, open: 517.50, high: 520.70, low: 517.30, volume: 64567800 },
    { date: "2024-02-03", price: 519.60, open: 518.90, high: 521.70, low: 518.70, volume: 65678900 },
    { date: "2024-02-04", price: 520.20, open: 519.60, high: 522.50, low: 519.30, volume: 66789000 },
    { date: "2024-02-05", price: 521.80, open: 520.20, high: 523.90, low: 520.00, volume: 67890100 },
    { date: "2024-02-06", price: 522.50, open: 521.80, high: 524.80, low: 521.60, volume: 68901200 },
    { date: "2024-02-07", price: 523.90, open: 522.50, high: 525.70, low: 522.30, volume: 69012300 },
    { date: "2024-02-08", price: 524.60, open: 523.90, high: 526.70, low: 523.70, volume: 70123400 },
    { date: "2024-02-09", price: 525.20, open: 524.60, high: 527.50, low: 524.30, volume: 71234500 },
    { date: "2024-02-10", price: 526.80, open: 525.20, high: 528.90, low: 525.00, volume: 72345600 },
    { date: "2024-02-11", price: 527.50, open: 526.80, high: 529.80, low: 526.60, volume: 73456700 },
    { date: "2024-02-12", price: 528.90, open: 527.50, high: 530.70, low: 527.30, volume: 74567800 },
    { date: "2024-02-13", price: 529.60, open: 528.90, high: 531.70, low: 528.70, volume: 75678900 },
    { date: "2024-02-14", price: 530.20, open: 529.60, high: 532.50, low: 529.30, volume: 76789000 },
    { date: "2024-02-15", price: 531.80, open: 530.20, high: 533.90, low: 530.00, volume: 77890100 },
    { date: "2024-02-16", price: 532.50, open: 531.80, high: 534.80, low: 531.60, volume: 78901200 },
    { date: "2024-02-17", price: 533.90, open: 532.50, high: 535.70, low: 532.30, volume: 79012300 },
    { date: "2024-02-18", price: 534.60, open: 533.90, high: 536.70, low: 533.70, volume: 80123400 },
    { date: "2024-02-19", price: 535.20, open: 534.60, high: 537.50, low: 534.30, volume: 81234500 },
    { date: "2024-02-20", price: 536.80, open: 535.20, high: 538.90, low: 535.00, volume: 82345600 },
    { date: "2024-02-21", price: 537.50, open: 536.80, high: 539.80, low: 536.60, volume: 83456700 },
    { date: "2024-02-22", price: 538.90, open: 537.50, high: 540.70, low: 537.30, volume: 84567800 },
    { date: "2024-02-23", price: 539.60, open: 538.90, high: 541.70, low: 538.70, volume: 85678900 },
    { date: "2024-02-24", price: 540.20, open: 539.60, high: 542.50, low: 539.30, volume: 86789000 },
    { date: "2024-02-25", price: 541.80, open: 540.20, high: 543.90, low: 540.00, volume: 87890100 },
    { date: "2024-02-26", price: 542.50, open: 541.80, high: 544.80, low: 541.60, volume: 88901200 },
    { date: "2024-02-27", price: 543.90, open: 542.50, high: 545.70, low: 542.30, volume: 89012300 },
    { date: "2024-02-28", price: 544.60, open: 543.90, high: 546.70, low: 543.70, volume: 90123400 },
    { date: "2024-02-29", price: 545.20, open: 544.60, high: 547.50, low: 544.30, volume: 91234500 },
    { date: "2024-03-01", price: 546.80, open: 545.20, high: 548.90, low: 545.00, volume: 92345600 },
    { date: "2024-03-02", price: 547.50, open: 546.80, high: 549.80, low: 546.60, volume: 93456700 },
    { date: "2024-03-03", price: 548.90, open: 547.50, high: 550.70, low: 547.30, volume: 94567800 },
    { date: "2024-03-04", price: 549.60, open: 548.90, high: 551.70, low: 548.70, volume: 95678900 },
    { date: "2024-03-05", price: 550.20, open: 549.60, high: 552.50, low: 549.30, volume: 96789000 },
    { date: "2024-03-06", price: 551.80, open: 550.20, high: 553.90, low: 550.00, volume: 97890100 },
    { date: "2024-03-07", price: 552.50, open: 551.80, high: 554.80, low: 551.60, volume: 98901200 },
    { date: "2024-03-08", price: 553.90, open: 552.50, high: 555.70, low: 552.30, volume: 99012300 },
    { date: "2024-03-09", price: 554.60, open: 553.90, high: 556.70, low: 553.70, volume: 100123400 },
    { date: "2024-03-10", price: 555.20, open: 554.60, high: 557.50, low: 554.30, volume: 101234500 },
  ],
}

export async function fetchStockData(symbol: string, interval = "15min", outputsize = 50): Promise<StockData[]> {
  try {
    // Always try real API first
    const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`

    console.log(`Fetching real data for ${symbol}...`)
    const data = await makeRequest(url, 1) // Time series costs 1 credit

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error("Invalid data format received from API")
    }

    // Convert API data to our format
    let stockData: StockData[] = data.values
      .map((item: any) => ({
        date: item.datetime,
        price: Number.parseFloat(item.close),
        open: Number.parseFloat(item.open),
        high: Number.parseFloat(item.high),
        low: Number.parseFloat(item.low),
        volume: Number.parseInt(item.volume) || 0,
      }))
      .filter((item: StockData) => !isNaN(item.price) && item.price > 0)
      .reverse() // Reverse to get chronological order

    // Filter to last 10 unique dates, then take up to 50 most recent data points
    const uniqueDates = Array.from(new Set(stockData.map(d => d.date.slice(0, 10)))).slice(-10)
    stockData = stockData.filter(d => uniqueDates.includes(d.date.slice(0, 10)))
    if (stockData.length > 50) {
      stockData = stockData.slice(-50)
    }

    if (stockData.length < 20) {
      throw new Error(`Failed to load data for ${symbol}. Only received ${stockData.length} data points from API, need at least 20 for training.`)
    }

    console.log(`Successfully loaded ${stockData.length} real data points for ${symbol}`)
    return stockData
  } catch (error) {
    console.error(`Error fetching real data for ${symbol}:`, error)
    // Only fallback to sample data for unknown symbols
    if (!sampleStockData[symbol]) {
      console.log(`Generating sample data for ${symbol} as last resort`)
      return generateSampleData(symbol)
    }
    throw error
  }
}

// Generate sample data for unknown symbols
function generateSampleData(symbol: string): StockData[] {
  const basePrice = 100 + Math.random() * 200
  const data: StockData[] = []
  
  for (let i = 0; i < 10; i++) {
    const date = new Date(2024, 0, i + 1).toISOString().split('T')[0]
    const price = basePrice + (Math.random() - 0.5) * 10
    const open = price + (Math.random() - 0.5) * 2
    const high = Math.max(open, price) + Math.random() * 3
    const low = Math.min(open, price) - Math.random() * 3
    const volume = Math.floor(Math.random() * 50000000) + 10000000
    
    data.push({
      date,
      price: Math.round(price * 100) / 100,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume,
    })
  }
  
  return data
}

export async function fetchMultipleStocks(symbols: string[]): Promise<MarketData[]> {
  if (symbols.length === 0) return []

  // In demo mode, use sample data for all symbols
  if (DEMO_MODE) {
    console.log("DEMO MODE: Using sample data for multiple stocks")
    return symbols.map(symbol => {
      const data = sampleStockData[symbol] || generateSampleData(symbol)
      const latest = data[data.length - 1]
      const previous = data[data.length - 2] || latest
      const change = latest.price - previous.price
      const changePercent = previous.price > 0 ? (change / previous.price) * 100 : 0

      return {
        symbol,
        name: symbol,
        price: latest.price,
        change,
        changePercent,
        volume: latest.volume || 0,
        marketCap: 0,
        lastUpdated: new Date().toISOString(),
      }
    })
  }

  // Use sample data for popular stocks to save credits
  const sampleSymbols = symbols.filter(symbol => sampleStockData[symbol])
  const apiSymbols = symbols.filter(symbol => !sampleStockData[symbol])

  const results: MarketData[] = []

  // Add sample data results
  sampleSymbols.forEach(symbol => {
    const data = sampleStockData[symbol]
    if (data && data.length > 0) {
      const latest = data[data.length - 1]
      const previous = data[data.length - 2] || latest
      const change = latest.price - previous.price
      const changePercent = previous.price > 0 ? (change / previous.price) * 100 : 0

      results.push({
        symbol,
        name: symbol,
        price: latest.price,
        change,
        changePercent,
        volume: latest.volume || 0,
        marketCap: 0,
        lastUpdated: new Date().toISOString(),
      })
    }
  })

  // Only make API calls for symbols not in sample data (limit to 3 to save credits)
  if (apiSymbols.length > 0) {
    const limitedSymbols = apiSymbols.slice(0, 3)
    const url = `${BASE_URL}/quote?symbol=${limitedSymbols.join(",")}&apikey=${API_KEY}`

    try {
      const raw = await makeRequest(url, 1)
      const items = Array.isArray(raw) ? raw : [raw]

      const apiResults = items.map(
        (d: any): MarketData => ({
          symbol: d.symbol,
          name: d.name ?? d.symbol,
          price: Number.parseFloat(d.close),
          change: Number.parseFloat(d.change) || 0,
          changePercent: Number.parseFloat(d.percent_change) || 0,
          volume: Number.parseInt(d.volume) || 0,
          marketCap: 0,
          lastUpdated: new Date().toISOString(),
        }),
      )

      results.push(...apiResults)
    } catch (error) {
      console.error("Error fetching multiple stocks from API:", error)
    }
  }

  return results
}

// Clear cache function that can be called externally
export function clearApiCache() {
  Object.keys(cache).forEach((key) => delete cache[key])
  console.log("API cache cleared")
}

// Get cache stats for debugging
export function getCacheStats() {
  return {
    cacheSize: Object.keys(cache).length,
    creditUsageThisMinute,
    timeUntilReset: 60000 - (Date.now() - lastCreditResetTime),
    demoMode: DEMO_MODE,
  }
}

// Function to get sample data for testing
export function getSampleStockData(symbol: string): StockData[] {
  return sampleStockData[symbol] || []
}

// Function to toggle demo mode
export function setDemoMode(enabled: boolean) {
  (globalThis as any).DEMO_MODE = enabled
  console.log(`Demo mode ${enabled ? 'enabled' : 'disabled'}`)
}

export async function searchStocks(query: string): Promise<string[]> {
  try {
    console.log(`Searching for stocks with query: ${query}`)
    
    const url = `${BASE_URL}/symbol_search?symbol=${encodeURIComponent(query)}&apikey=${API_KEY}`
    const data = await makeRequest(url, 1) // Symbol search costs 1 credit

    if (!data.data || !Array.isArray(data.data)) {
      console.log("No search results found")
      return []
    }

    // Filter for US stocks and extract symbols
    const usStocks = data.data
      .filter((item: any) => 
        item.country === 'US' && 
        item.currency_base === 'USD' &&
        item.type === 'Common Stock'
      )
      .map((item: any) => item.symbol)
      .slice(0, 10) // Limit to top 10 results

    console.log(`Found ${usStocks.length} US stocks for query: ${query}`)
    return usStocks
  } catch (error) {
    console.error(`Error searching stocks for ${query}:`, error)
    return []
  }
}
