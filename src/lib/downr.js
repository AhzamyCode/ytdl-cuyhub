import axios from 'axios';

export async function ddownr(url, format = '720') {
  try {
    const downloadResponse = await axios({
      method: 'GET',
      url: 'https://p.savenow.to/ajax/download.php',
      params: {
        copyright: '0',
        format: format,
        url: url,
        api: 'dfcb6d76f2f6a9894gjkege8a4ab232222'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://ddownr.com/',
        'Origin': 'https://ddownr.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'Priority': 'u=4',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    const downloadId = downloadResponse.data.id || downloadResponse.data.download_id;
    const videoInfo = downloadResponse.data.info;

    if (!downloadId) {
      throw new Error('No download ID received');
    }

    let attempts = 0;
    const maxAttempts = 30;
    const pollInterval = 2000;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const progressResponse = await axios({
        method: 'GET',
        url: 'https://p.savenow.to/api/progress',
        params: {
          id: downloadId
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://ddownr.com/',
          'Origin': 'https://ddownr.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Priority': 'u=4',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });


      if (progressResponse.data.success || progressResponse.data.download_url || progressResponse.data.status === 'finished') {
        

        let finalUrl = progressResponse.data.download_url;

        if (finalUrl && finalUrl.includes('savenow.to/pacific')) {
          try {
            const redirectResponse = await axios({
              method: 'HEAD',
              url: finalUrl,
              maxRedirects: 0,
              validateStatus: (status) => status >= 200 && status < 400,
              headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0',
                'Accept': '*/*',
                'Referer': 'https://ddownr.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site'
              }
            });

            if (redirectResponse.headers.location) {
              finalUrl = redirectResponse.headers.location;
            }
          } catch (error) {

          }
        }

        return {
          title: videoInfo?.title || 'Unknown',
          thumbnail: videoInfo?.image || '',
          download_url: finalUrl
        };
      }

      if (progressResponse.data.error || progressResponse.data.status === 'error') {
        throw new Error(progressResponse.data.error || 'Gagal woyy');
      }

      attempts++;
    }

    throw new Error('Timeout: kelamaan jirr');

  } catch (error) {
    throw error;
  }
}