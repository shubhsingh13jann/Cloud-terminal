import http from 'http'
import mongoose from 'mongoose'
import Redis from 'ioredis'

const checks = {
  api: false,
  mongodb: false,
  redis: false,
}

console.log('\n🔍 Running health checks...\n')

// ===========================
// Check API
// ===========================z`
const checkAPI = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      if (res.statusCode === 200) {
        checks.api = true
        console.log('✅ API         — Running on port 5000')
      } else {
        console.log('❌ API         — Not responding correctly')
      }
      resolve()
    })
    req.on('error', () => {
      console.log('❌ API         — Not running on port 5000')
      resolve()
    })
    req.setTimeout(3000, () => {
      console.log('❌ API         — Timeout after 3 seconds')
      req.destroy()
      resolve()
    })
  })
}

// ===========================
// Check MongoDB
// ===========================
const checkMongoDB = async () => {
  try {
    await mongoose.connect(
      'mongodb://admin:password123@localhost:27017/cloud-terminal?authSource=admin',
      { serverSelectionTimeoutMS: 3000 }
    )
    checks.mongodb = true
    console.log('✅ MongoDB     — Connected on port 27017')
    await mongoose.disconnect()
  } catch {
    console.log('❌ MongoDB     — Not running on port 27017')
  }
}

// ===========================
// Check Redis
// ===========================
const checkRedis = async () => {
  return new Promise((resolve) => {
    const redis = new Redis({
      host: 'localhost',
      port: 6379,
      connectTimeout: 3000,
      lazyConnect: true,
    })

    redis.connect()
      .then(async () => {
        await redis.ping()
        checks.redis = true
        console.log('✅ Redis       — Connected on port 6379')
        await redis.quit()
        resolve()
      })
      .catch(() => {
        console.log('❌ Redis       — Not running on port 6379')
        resolve()
      })
  })
}

// ===========================
// Run all checks
// ===========================
const runChecks = async () => {
  await checkAPI()
  await checkMongoDB()
  await checkRedis()

  console.log('\n─────────────────────────────')

  const allPassed = Object.values(checks).every(Boolean)

  if (allPassed) {
    console.log('🎉 All systems operational!\n')
    process.exit(0)
  } else {
    const failed = Object.entries(checks)
      .filter(([, v]) => !v)
      .map(([k]) => k)
    console.log(`⚠️  Failed checks: ${failed.join(', ')}\n`)
    process.exit(1)
  }
}

runChecks()