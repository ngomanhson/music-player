// 1. Render songs
// 2. Scroll top
// 3. Play / pause / seek 
// 4. CD rotate
// 5 Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'DAUTO_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRanDom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Hôm Nay Tôi Buồn',
            singer: 'Phùng Khánh Linh',
            path: './assets/music/song1.mp3',
            image: './assets/images/song1.png'
        },
        {
            name: 'Tháng Tư Là Lời Nói Dối Của Em',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song2.mp3',
            image: './assets/images/song2.png'
        },
        {
            name: 'Chuyện Đôi Ta',
            singer: 'Emcee L (Da LAB) ft Muộii',
            path: './assets/music/song3.mp3',
            image: './assets/images/song3.png'
        },
        {
            name: 'Thức Giấc',
            singer: 'Da LAB',
            path: './assets/music/song4.mp3',
            image: './assets/images/song4.png'
        },
        {
            name: 'Mặt Mộc',
            singer: 'Phạm Nguyên Ngọc x VAnh x Ân Nhi',
            path: './assets/music/song5.mp3',
            image: './assets/images/song5.png'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path: './assets/music/song6.mp3',
            image: './assets/images/song6.png'
        },
        {
            name: 'Sài Gòn Hôm Nay Mưa',
            singer: 'JSOL x Hoàng Duyên',
            path: './assets/music/song7.mp3',
            image: './assets/images/song7.png'
        },
        {
            name: 'Chờ Đợi Có Đáng Sợ',
            singer: 'Andiez x Freak D',
            path: './assets/music/song8.mp3',
            image: './assets/images/song8.png'
        },
        {
            name: 'Suýt Nữa Thì',
            singer: 'Andiez',
            path: './assets/music/song9.mp3',
            image: './assets/images/song9.png'
        },
        {
            name: 'Bông Hoa Đẹp Nhất',
            singer: 'Quân A.P',
            path: './assets/music/song10.mp3',
            image: './assets/images/song10.png'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xu ly CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 100000,
            interations: Infinity
        })
        cdThumbAnimate.pause()

        //Xu ly phong to / thu nho CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xu ly khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
            
        //Khi song duoc play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi song bi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xu ly khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Khi next song
        nextBtn.onclick = function() {
            if (_this.isRanDom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRanDom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.scrollToActiveSong()
        }

        //Xu ly random on / off
        randomBtn.onclick = function(e) {
            _this.isRanDom = !_this.isRanDom
            _this.setConfig('isRandom', _this.isRanDom)
            randomBtn.classList.toggle('active', _this.isRanDom)
        }

        //Xu ly lap lai 1 song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xu ly next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //Lang nghe hanh vi click vao playlis
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('option') ) {
                //Xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Xu ly ki click vao song opyion
                if (e.target.closest('option')) {

                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent  = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRanDom = this.config.isRanDom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        //Gan cau hinh tu config vao ung dung
        this.loadConfig()

        //Dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        //Lang nghe / xu ly cac su kien (DOM events)
        this.handleEvents()

        //Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //Hien thi trang thai ban dau cua button random & repeat
        randomBtn.classList.toggle('active', this.isRanDom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start();