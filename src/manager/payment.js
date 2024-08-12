export async function starPaymentFetch(_title, _description, _prices) {

    const fetchResult = {
        success: false,
        data: null,
        error: false
    };

    const request ={
        title: _title,
        description: _description,
        payload: "product_payload",
        currency: "XTR",
        prices: _prices
      };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    };

    try {        
        const url = `https://tight-unit-6b8a.bombomdon.workers.dev/tg-star-payment`;

        await fetch(url, options).then(response => response.json()).then(data => {
            if(data.ok){
                fetchResult.success = true;
                fetchResult.data = data.result;
            }else{
                fetchResult.success = false;
                fetchResult.error = data;
            }
        });


    } catch (err) { fetchResult.success = false; fetchResult.error = true; fetchResult.data = err; }

    return fetchResult;
}