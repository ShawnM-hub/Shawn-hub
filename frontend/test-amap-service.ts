
const key = process.env.AMAP_WEB_SERVICE_KEY;
const url = `https://restapi.amap.com/v3/place/text?keywords=Haidilao&city=Beijing&key=${key}`;

console.log('Testing AMap Web Service API...');
console.log('Key:', key ? '***' + key.slice(-4) : 'Missing');

async function testAmap() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('Response Status:', data.status);
        console.log('Response Info:', data.info);
        if (data.status === '1') {
            console.log('? AMap Web Service API is working!');
            if (data.pois && data.pois.length > 0) {
                console.log('Found POI:', data.pois[0].name);
            }
        } else {
            console.error('? AMap API Failed:', data.info);
        }
    } catch (e: any) {
        console.error('Network Error:', e.message);
    }
}

testAmap();
