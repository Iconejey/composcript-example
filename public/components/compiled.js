
function renderComposcriptHTMl(html) {
	const div = document.createElement('div');
	div.innerHTML = html;
	const elem = div.firstElementChild;
	elem.remove();
	return elem;
}

class ComposcriptComponent extends HTMLElement {
	constructor(attr) {
		super();

		this.creation_complete = false;

		if (attr) {
			for (let key in attr) this.setAttribute(key, attr[key]);
		}
	}

	async connectedCallback() {
		if (!this.creation_complete) {
			this.creation_complete = true;
			const content = this.innerHTML;

			for (const req_attr of this.requiredAttributes) {
				if (!this.hasAttribute(req_attr)) {
					throw new Error(`Required attribute "${req_attr}" not found`);
				}
			}
			
			this.created(content);
		}
	}

}

class MainApp extends ComposcriptComponent {
	constructor(attr) { super(attr); }

	async created(content) {
		this.innerHTML = `
			<h1>Loading...</h1>
		`;

		this.loadTweets(await getTweets());
	}

	loadTweets(tweets) {
		this.innerHTML = `
			<h1>Tweets</h1>
			<div id="tweets-container"></div>
		`;

		const test_div = (
			renderComposcriptHTMl(`<div id="test-div">
				<h1>Test</h1>
				<!-- <p>Coucou, c'est un test</p> -->
			</div>`)
		);

		test_div.innerHtml = '<h2>Test 2</h2>';

		const second_test = renderComposcriptHTMl(`<div class="test2">hey</div>`);

		for (const tweet of tweets) {
			this.tweets_container.appendChild(renderComposcriptHTMl(`<tweet-panel tweet=${tweet} noshare />`));
		}
	}

	get requiredAttributes() {
		return [];
	}
	}

document.registerElement('main-app', MainApp);

async function getTweets() {
	return ['a5b4c3', 'd2e1f0', 'g9h8i7'];
}

class TweetPanel extends ComposcriptComponent {
	constructor(attr) { super(attr); }

	async created(content) {
		const data = await getTweetData(this.tweet);

		this.innerHTML = `
			<div id="top">
				<div id="user">
					<h3>${data.user}</h3>
					<p>@${data.tag}</p>
				</div>
			</div>

			<p>${data.text}</p>

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

	get requiredAttributes() {
		return ["tweet"];
	}
	
	get tweet() {
		return this.getAttribute('tweet');
	}

	set tweet(val) {
		this.setAttribute('tweet', val);
	}
			
	get noshare() {
		return this.hasAttribute('noshare');
	}

	set noshare(val) {
		this.toggleAttribute('noshare', val);
	}
			
	get liked() {
		return this.classList.contains('liked');
	}

	set liked(val) {
		this.classList.toggle('liked', val);
	}
			
	get retweeted() {
		return this.classList.contains('retweeted');
	}

	set retweeted(val) {
		this.classList.toggle('retweeted', val);
	}
			}

document.registerElement('tweet-panel', TweetPanel);

async function getTweetData(tweet_id) {
	return {
		id: tweet_id,
		user: 'John Doe',
		tag: 'johndoe',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		liked: true,
		retweeted: false
	};
}
