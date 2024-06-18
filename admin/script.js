const postForm = document.getElementById('post-form');

postForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const title = document.getElementById('title').value;
	const body = document.getElementById('body').value;
	const resp = await fetch('/send-notifications', {
		method: 'post',
		headers: {
			'content-Type': 'application/json',
		},
		body: JSON.stringify({ title, body }),
	});
	if (resp.status === 201) {
		console.log(resp);
	} else {
		console.log('error');
	}
});
