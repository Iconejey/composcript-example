function render(html) {
	const div = document.createElement('div');
	div.innerHTML = html;
	const elem = div.firstElementChild;
	elem.remove();
	return elem;
}

class TweetPanel extends HTMLElement {
	constructor(attr) {
		super();

		this.created = false;

		if (attr) {
			for (let key in attr) this.setAttribute(key, attr[key]);
		}
	}

	async connectedCallback() {
		if (!this.created) {
			this.created = true;
			const content = this.innerHTML;
			this.innerHTML = '';
			this.created(content);
		}
	}

	clearClassesAndAttributes() {
		for (const attr of this.attributes) attr.remove();
	}

	async created(content) {
		const data = await getTweetData(this.tweet);

		this.innerHTML = `
			<div id="top">
				<div id="user">
					<h3>${data.user}</h3>
					<p>@${data.tag}</p>
				</div>
			</div>

			<p>${content}</p>

			<div id="btns">
				<a href="#" class="btn" id="like">
					<i class="icon">like</i>
				</a>

				<a href="#" class="btn" id="retweet">
					<i class="icon">retweet</i>
				</a>
			</div>
		`;

		this.liked = data.liked;
		this.retweeted = data.retweeted;
	}

	// <tweet-panel tweet! noshare? .liked .retweeted></tweet-panel>

	set tweet(val) {
		this.setAttribute('tweet', val);
	}

	get tweet() {
		return this.getAttribute('tweet');
	}

	set noshare(val) {
		this.toggleAttribute('noshare', val);
	}

	get noshare() {
		return this.hasAttribute('noshare');
	}

	set liked(val) {
		this.classList.toggle('liked', val);
	}

	get liked() {
		return this.classList.contains('liked');
	}

	set retweeted(val) {
		this.classList.toggle('retweeted', val);
	}

	get retweeted() {
		return this.classList.contains('retweeted');
	}
}

customElements.define('tweet-panel', TweetPanel);

async function getTweetData(id) {
	return {
		id,
		user: 'John Doe',
		text: 'Lorem ipsum dolor  sit amet, consectetur adipiscing elit.',
		liked: true,
		retweeted: false
	};
}
