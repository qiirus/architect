import { join } from 'node:path'
import http from 'node:http'
import https from 'node:https'

import unzipper from 'unzipper'
import { createWriteStream } from 'node:fs'

export const generateApplication = (name, currentPath) => {
  // const frameworkUrl = 'https://github.com/rest-flow/framework/archive/refs/heads/feat/initial-setup.zip'
  const frameworkUrl = 'https://codeload.github.com/rest-flow/framework/zip/refs/heads/feat/initial-setup'
  // const frameworkUrl = 'https://www2.census.gov/geo/tiger/TIGER2015/ZCTA5/tl_2015_us_zcta510.zip'

  return download(frameworkUrl, join(currentPath, name))
}

const download = (url, appPath) => {
  return new Promise((resolve, reject) => {
    // Determine the protocol (http or https)
    const protocol = url.startsWith('https') ? https : http

    // Create a writable stream to save the ZIP file temporarily
    const zipFilePath = join(appPath, '../', 'temp.zip')
    const writeStream = createWriteStream(zipFilePath)

    // Download the ZIP file
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`))
        return
      }

      // Pipe the response to the writable stream
      response.pipe(writeStream)

      // When the download is complete, unzip the file
      writeStream.on('finish', async () => {
        const directory = await unzipper.Open.file(zipFilePath)

        await directory.extract({ path: appPath })

        resolve(`File downloaded and unzipped to ${appPath}`)
      })

      writeStream.on('error', (err) => {
        reject(new Error(`Failed to save the file: ${err.message}`))
      })
    }).on('error', (err) => {
      reject(new Error(`Failed to download the file: ${err.message}`))
    })
  })
}

// const download = async (url, appPath) => {
//   return new Promise((resolve, reject) => {
//     const isHttps = url.startsWith('https://')
//     const requestModule = isHttps ? httpsRequest : request

//     const req = requestModule(url, async (res) => {
//       if (res.statusCode === 302) {
//         // Handle redirect
//         const redirectUrl = res.headers.location
//         console.log(`Redirecting to: ${redirectUrl}`)
//         await download(redirectUrl, appPath)
//         resolve()
//         return
//       }

//       if (res.statusCode !== 200) {
//         reject(new Error(`Failed to download file: ${res.statusCode}`))
//         return
//       }

//       try {
//         const unzipStream = unzipper.Parse()
//         res.pipe(unzipStream) // Pipe response to the unzip parser

//         for await (const entry of unzipStream) {
//           const filePath = join(appPath, entry.path)

//           if (entry.type === 'Directory') {
//             await mkdir(filePath, { recursive: true })
//           } else {
//             await mkdir(dirname(filePath), { recursive: true })
//             const writeStream = createWriteStream(filePath)
//             await pipeline(entry, writeStream)
//           }
//         }

//         resolve()
//       } catch (error) {
//         reject(error)
//       }
//     })

//     req.on('error', (error) => {
//       reject(error)
//     })

//     req.end()
//   })
// }

// Example usage:
// download('https://example.com/path/to/zipfile.zip', '/path/to/app')
//   .then(() => console.log('Download and unzip completed!'))
//   .catch((error) => console.error('Error:', error));
