// 3D粒子效果初始化
function initParticles() {
    const container = document.getElementById('particles-3d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 增强粒子系统
    const particles = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    const sizes = new Float32Array(particles);
    const velocities = new Float32Array(particles * 3);

    // HSV颜色生成器
    const hsvToRgb = (h, s, v) => {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch(i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        
        return [r, g, b];
    };

    // 初始化粒子
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;
        
        velocities[i] = (Math.random() - 0.5) * 0.2;
        velocities[i + 1] = (Math.random() - 0.5) * 0.2;
        velocities[i + 2] = (Math.random() - 0.5) * 0.2;
        
        const hue = Math.random();
        const [r, g, b] = hsvToRgb(hue, 0.9, 0.9);
        colors[i] = r;
        colors[i + 1] = g;
        colors[i + 2] = b;
        
        sizes[i/3] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 增强材质设置
    const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 500;

    // 鼠标交互
    const mouse = new THREE.Vector2();
    const mouseForce = 5;
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 增强动画循环
    let hueOffset = 0;
    function animate() {
        requestAnimationFrame(animate);
        
        const positions = particleSystem.geometry.attributes.position.array;
        const colors = particleSystem.geometry.attributes.color.array;
        
        // 更新粒子位置和颜色
        for (let i = 0; i < positions.length; i += 3) {
            // 应用鼠标力
            const dx = positions[i] - mouse.x * 1000;
            const dy = positions[i + 1] - mouse.y * 1000;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 300) {
                const force = mouseForce * (1 - distance / 300);
                positions[i] += dx / distance * force;
                positions[i + 1] += dy / distance * force;
            }
            
            // 边界检查
            if (Math.abs(positions[i]) > 1000) velocities[i] *= -1;
            if (Math.abs(positions[i + 1]) > 1000) velocities[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 1000) velocities[i + 2] *= -1;
            
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            // 动态颜色变化
            const [r, g, b] = hsvToRgb((hueOffset + i/positions.length) % 1, 0.9, 0.9);
            colors[i] = r;
            colors[i + 1] = g;
            colors[i + 2] = b;
        }
        
        hueOffset += 0.0005;
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
        
        particleSystem.rotation.x += 0.0003;
        particleSystem.rotation.y += 0.0007;
        
        renderer.render(scene, camera);
    }
    animate();

    // 窗口大小调整
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 模拟数据 - 实际使用时可以替换为真实API请求
const recommendationData = {
    movies: [
        {
            id: 1,
            title: "银翼杀手2049",
            description: "极致的赛博美学",
            posterUrl: "img/p2501864539.webp"
        },
        {
            id: 2,
            title: "僵尸世界大战",
            description: "全球僵尸危机生存之战",
            posterUrl: "img/p2211899397.webp"
        },
        {
            id: 3,
            title: "我是传奇",
            description: "末日纽约的孤独生存",
            posterUrl: "img/p574158935.webp"
        },
        {
            id: 4,
            title: "釜山行",
            description: "韩国丧尸列车惊魂",
            posterUrl: "img/p2360940399.webp"
        },
        {
            id: 5,
            title: "猩球崛起系列",
            description: "智能猿族的反抗之路",
            posterUrl: "img/p2494096554.webp"
        },
        {
            id: 6,
            title: "指环王系列",
            description: "魔戒远征队启程",
            posterUrl: "img/p2642829472.webp"
        },
        {
            id: 7,
            title: "哈利波特系列",
            description: "魔法世界的开端",
            posterUrl: "img/p2913456984.webp"
        },
        {
            id: 8,
            title: "星际穿越",
            description: "穿越时空的父女情",
            posterUrl: "img/p2614988097.webp"
        }
    ],
    
    animes: [
        {
            id: 1,
            title: "凡人修仙传",
            description: "国漫巅峰之一",
            posterUrl: "img/p2918922518.webp"
        },
        {
            id: 2,
            title: "紫罗兰永恒花园",
            description: "自动手记人偶的感人故事",
            posterUrl: "img/p2527061120.webp"
        },
        {
            id: 3,
            title: "Re:从零开始的异世界生活",
            description: "异世界轮回冒险",
            posterUrl: "img/p2873497694.webp"
        },
        {
            id: 4,
            title: "魔女之旅",
            description: "旅行的魔女见闻录",
            posterUrl: "img/p2621996851.webp"
        },
        {
            id: 5,
            title: "灵笼",
            description: "末日废土生存故事",
            posterUrl: "img/p2921805655.webp"
        },
        {
            id: 6,
            title: "第一序列",
            description: "末世超能力战斗",
            posterUrl: "img/p2893592434.webp"
        },
        {
            id: 7,
            title: "天官赐福",
            description: "仙侠耽美动画",
            posterUrl: "img/p2621050857.webp"
        },
        {
            id: 8,
            title: "关于我转生变成史莱姆这档事",
            description: "异世界转生冒险",
            posterUrl: "img/p2637358811.webp"
        }
    ],
    
    books: [
        {
            id: 1,
            title: "中国文脉",
            description: "余秋雨解读中国文化脉络",
            posterUrl: "img/s29442406.jpg"
        },
        {
            id: 2,
            title: "文化苦旅",
            description: "余秋雨的文化考察笔记",
            posterUrl: "img/s27226968.jpg"
        },
        {
            id: 3,
            title: "楚字是这样写成的",
            description: "楚文化研究专著",
            posterUrl: "img/s34492940.jpg"
        },
        {
            id: 4,
            title: "周易",
            description: "中国古代哲学经典",
            posterUrl: "img/s27445616.jpg"
        },
        {
            id: 5,
            title: "淮南子",
            description: "汉代道家思想集成",
            posterUrl: "img/s4720618.jpg"
        },
        {
            id: 6,
            title: "中庸",
            description: "儒家四书之一",
            posterUrl: "img/s28261122.jpg"
        },
        {
            id: 7,
            title: "孟子",
            description: "儒家经典著作",
            posterUrl: "img/s4442185.jpg"
        },
        {
            id: 8,
            title: "诗经",
            description: "中国最早诗歌总集",
            posterUrl: "img/s27267713.jpg"
        },
        {
            id: 9,
            title: "话说中庸",
            description: "南怀瑾解读中庸",
            posterUrl: "img/s34410482.jpg"
        },
        {
            id: 10,
            title: "孟子与公孙丑",
            description: "孟子思想研究",
            posterUrl: "img/s7041765.jpg"
        },
        {
            id: 11,
            title: "战国策",
            description: "战国时期历史文献",
            posterUrl: "img/s1587941.jpg"
        },
        {
            id: 12,
            title: "人间词话",
            description:"王国维文学批评著作",
            posterUrl: "img/s28849019.jpg"
        }
    ]
};

// 显示加载动画
const loader = document.querySelector('.cyber-loader');

// 模拟加载过程
function simulateLoading() {
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500); // 1.5秒后隐藏加载动画
}

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 初始化3D粒子背景
    initParticles();

    // 加载所有推荐卡片
    loadRecommendations('movie-carousel', recommendationData.movies);
    loadRecommendations('anime-carousel', recommendationData.animes);
    loadRecommendations('book-carousel', recommendationData.books);

    // 为所有箭头按钮添加事件监听
    setupCarouselControls();

    // 启动加载动画
    simulateLoading();
});

// 加载推荐卡片
function loadRecommendations(carouselId, items) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const container = carousel.querySelector('.cards-container');
    container.innerHTML = ''; // 清空容器

    items.forEach(item => {
        const card = createCardElement(item);
        container.appendChild(card);
    });

    // 初始化卡片交互
    initCardInteractions(container);
}

// 创建单个卡片元素
function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.id;

    const poster = document.createElement('img');
    poster.className = 'card-poster';
    poster.src = item.posterUrl;
    poster.alt = item.title;

    const info = document.createElement('div');
    info.className = 'card-info';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = item.title;

    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = item.description;

    info.appendChild(title);
    info.appendChild(desc);
    card.appendChild(poster);
    card.appendChild(info);

    return card;
}

// 设置轮播控制
function setupCarouselControls() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const leftBtn = carousel.querySelector('.arrow.left');
        const rightBtn = carousel.querySelector('.arrow.right');
        const container = carousel.querySelector('.cards-container');

        if (leftBtn && rightBtn && container) {
            leftBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });

            // 根据卡片宽度计算滑动距离
            const cardWidth = container.querySelector('.card')?.offsetWidth || 220;
            const scrollDistance = cardWidth * 2 + 20; // 翻页幅度增大为两倍卡片宽度
            
            leftBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: -scrollDistance,
                    behavior: 'smooth'
                });
            });

            rightBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: scrollDistance,
                    behavior: 'smooth'
                });
            });

            // 添加触摸滑动支持
            let startX, scrollLeft;
            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].pageX;
                scrollLeft = container.scrollLeft;
            });

            container.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const x = e.touches[0].pageX;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
        }
    });
}

// 初始化卡片交互效果
function initCardInteractions(container) {
    const cards = container.querySelectorAll('.card');
    
    cards.forEach(card => {
        // 鼠标悬停效果增强
        card.addEventListener('mouseenter', () => {
            const info = card.querySelector('.card-info');
            info.style.opacity = '1';
            info.style.transform = 'translateY(0)';
        });

        card.addEventListener('mouseleave', () => {
            const info = card.querySelector('.card-info');
            info.style.opacity = '0.9';
            info.style.transform = 'translateY(10px)';
        });
    });
}

// 未来可扩展功能：
// 1. 真实API数据获取
// 2. 分页加载更多
// 3. 卡片点击详情
// 4. 响应式调整卡片数量
