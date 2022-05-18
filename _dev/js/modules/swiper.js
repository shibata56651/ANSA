import Swiper from 'swiper/bundle';

/**
 * カルーセル
 */
export class swiper {
	/**
	 * @param  {Element} element rootとなる要素
	 * @param  {Object} options オプション（連想配列）
	 * @returns void
	 */
	constructor(element, options = {}) {
		const defaultOptions = {
			timer: false,
			playBtnClass: 'js-carousel-play',
			playTxtClass: 'js-play-txt',
			isPauseClass: 'is-pause',
			isActiveSlideClass: 'is-active-slide',
			playTxt: '\u518D\u751F', // 再生
			pauseTxt: '\u4E00\u6642\u505C\u6B62', // 一時停止
			activeSlideLength: { // アクティブにしたいスライドの数をswiperオプションのブレイクポイントごとに必ず指定する
				breakpoints: {
					max: 1,
				},
			},
			swiperOptions: {}, // swiper.jsで使用されるオプションを設定
		};

		this.o = Object.assign(defaultOptions, options);
		this.root = element;
		this.modalHook = document.querySelectorAll('.js-modal-hook');
		this.swiper = new Swiper(this.root, this.o.swiperOptions);
		this.autoPlay = this.swiper.autoplay.running; // autoPlayが有効かどうか
		if (this.autoPlay) {
			this.playBtn = this.root.querySelector(`.${this.o.playBtnClass}`);
			this.playTxt = this.playBtn.querySelector(`.${this.o.playTxtClass}`);
			this.isPlay = false;
		}
		this.totalActiveLength = 0;
		this.addActiveLength = 0;
		this.isDuplicateSlide = false;

		this.init();
	}

	/**
	 * 初期初期、イベント付与
	 *
	 * @returns void
	 */
	init() {
		this.updateActiveSlide();
		this.swiper.on('breakpoint', this.updateActiveSlide.bind(this)); // 'breakpoint'イベントは、APIが公式で提供しているものではない
		this.swiper.on('slideChange', this.updateActiveSlideAttribute.bind(this));
		if (this.autoPlay) {
			this.playBtn.addEventListener('click', this.playControls.bind(this));
			this.swiperPlay();

			this.isPlay = true;
		}
	}

	/**
	 * swiperが提供するアクティブなスライドのほかに、見えているスライド（前後何枚）をアクティブとするかを計算する
	 *
	 * @returns void
	 */
	updateActiveSlide() {
		/**
		 * .currentBreakpointプロパティは、APIが公式で提供しているものではない
		 * 現在の画面幅にあたる、swiperのOption（breakpoints）で指定した値を返す
		 * 最大値は`max`で返る
		 */
		const swiperCurrentBreakpoint = this.swiper.currentBreakpoint;

		if (this.o.activeSlideLength.breakpoints[swiperCurrentBreakpoint]) {
			if (
				swiperCurrentBreakpoint === 'max' ||
				swiperCurrentBreakpoint > window.innerWidth
			) {
				this.totalActiveLength = this.o.activeSlideLength.breakpoints[swiperCurrentBreakpoint];
			}
		}

		this.addActiveLength = this.totalActiveLength > 1 ? Math.floor(this.totalActiveLength / 2) : 0; // 前後何枚をアクティブにするかを計算

		this.updateActiveSlideAttribute();
	}

	/**
	 * すべてのスライドのアクティブ時用の属性を削除する
	 *
	 * @returns void
	 */
	resetActiveSlideAttribute() {
		for (let i = 0, slideLen = this.swiper.slides.length; i < slideLen; i++) {
			const slide = this.swiper.slides[i];
			const link = slide.querySelectorAll('a');

			for (const tabItem of link) {
				if (tabItem) {
					slide.classList.remove(this.o.isActiveSlideClass);
					tabItem.tabIndex = '-1';
				} else {
					tabItem.tabIndex = '-1';
				}
			}
		}
	}

	/**
	 * アクティブなスライドにアクティブ時用の属性を付与する
	 *
	 * @returns void
	 */
	updateActiveSlideAttribute() {
		this.resetActiveSlideAttribute();

		const addActiveSlides = [this.swiper.slides[this.swiper.activeIndex]]; // 本来アクティブなスライドを配列に追加
		const swiperPaginationBullet = document.querySelectorAll('.swiper-pagination-bullet');

		for (let i = 0; i < this.addActiveLength; i++) {
			addActiveSlides.push(this.swiper.slides[this.swiper.activeIndex + (i + 1)]); // アクティブなスライドの次を追加
			addActiveSlides.push(this.swiper.slides[this.swiper.activeIndex - (i + 1)]); // アクティブなスライドの前を追加
		}

		for (const slide of addActiveSlides) {
			const link = slide.querySelectorAll('a');

			for (const tabItem of link) {
				if (tabItem) {
					slide.classList.add(this.o.isActiveSlideClass);
					tabItem.tabIndex = '0';

					if (document.querySelector('html body').classList.contains('is-modal-fixed')) {
						tabItem.tabIndex = '-1';

						for (const bullet of swiperPaginationBullet) {
							bullet.tabIndex = '-1';
						}
					}
				} else {
					tabItem.tabIndex = '-1';
				}
			}
		}
	}

	/**
	 * スライドの再生
	 *
	 * @returns void
	 */
	swiperPlay() {
		this.isPlay = true;
		this.playBtn.classList.remove(this.o.isPauseClass);
		this.playTxt.textContent = this.o.pauseTxt;
		this.swiper.autoplay.start();
	}

	/**
	 * スライドの一時停止
	 *
	 * @returns void
	 */
	swiperPause() {
		this.playBtn.classList.add(this.o.isPauseClass);
		this.playTxt.textContent = this.o.playTxt;
		this.swiper.autoplay.stop();
		this.isPlay = false;
	}

	/**
	 * スライドの再生・一時停止
	 *
	 * @returns void
	 */
	playControls() {
		if (this.isPlay) { // 再生中の場合、一時停止する
			this.swiperPause();

			if (this.o.timer) {
				this.timelineAnimation.pause();
			}
		} else {
			this.swiperPlay();

			if (this.o.timer) {
				this.timelineAnimation.cancel();
				this.timelineAnimation.play();
			}
		}
	}
}
