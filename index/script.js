if ('serviceWorker' in navigator && 'PushManager' in window) {
	navigator.serviceWorker.register('/sw.js').then((swReg) => {
		console.log('Service Worker is registered', swReg);

		swReg.pushManager.getSubscription().then((subscription) => {
			if (subscription === null) {
				subscribeUser(swReg);
			} else {
				console.log('User is already subscribed:', subscription);
			}
		});
	});
}

function subscribeUser(swReg) {
	const applicationServerKey = urlB64ToUint8Array('BJZJ4NEQV37ZZlwsTGR3a6wiCY4m1GTQ-HOBsCIzlNe2dZQCdryJLc-6Zd6AvzOaBVHiiONnFBWwiGUxMpCEsu4');
	swReg.pushManager
		.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey,
		})
		.then((subscription) => {
			console.log('User is subscribed:', subscription);

			// Send subscription to your backend
			saveSubscription(subscription);
		})
		.catch((err) => {
			console.log('Failed to subscribe user: ', err);
		});
}

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function saveSubscription(subscription) {
	fetch('http://localhost:3000/save-subscription', {
		method: 'POST',
		body: JSON.stringify(subscription),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

fetch('/data', {
	method: 'get',
	headers: {
		'content-Type': 'application/json',
	},
})
	.then((resp) => resp.json())
	.then((data) =>
		data.map((data) => {
			const post = document.createElement('div');
			post.className = 'post';
			const title = document.createElement('a');
			title.className = 'title';
			title.href = `/post/${data.id}`
			const body = document.createElement('p');
			body.className = 'body';
			title.textContent = data.title;
			body.textContent = data.body;
			post.append(title);
			post.append(body);
			document.getElementById('posts').append(post);
		})
	);
