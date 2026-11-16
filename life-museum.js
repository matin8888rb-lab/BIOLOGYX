import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let initialized = false;
window.initLifeExplorer = () => {
  if (initialized) return;
  const host = document.getElementById('life3d');
  if (!host) return;
  initialized = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x172e38);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(6.5, 4.5, 7.5);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.localClippingEnabled = true;
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.minDistance = 2.3;
  controls.maxDistance = 17;
  controls.maxPolarAngle = Math.PI * 0.92;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xe8f5ee, 0x25313b, 2.0));
  const key = new THREE.DirectionalLight(0xffe7c5, 3.1);
  key.position.set(5, 8, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8ccfff, 2.0);
  rim.position.set(-6, 3, -5); scene.add(rim);
  const fill = new THREE.PointLight(0x9de2c2, 45, 20);
  fill.position.set(0, -2, 4); scene.add(fill);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 72),
    new THREE.MeshStandardMaterial({ color: 0x203e48, roughness: 0.92 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.35; scene.add(floor);
  const grid = new THREE.GridHelper(12, 24, 0x44616a, 0x304c55);
  grid.position.y = -2.34; grid.material.transparent = true; grid.material.opacity = 0.22; scene.add(grid);

  const root = new THREE.Group(); scene.add(root);
  let parts = {}, spin = false, cut = false, currentType = 'bacteria';
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const mat = (color, roughness = 0.42, opts = {}) => new THREE.MeshPhysicalMaterial({
    color, roughness, metalness: 0, side: THREE.DoubleSide,
    transparent: !!opts.transparent, opacity: opts.opacity ?? 1,
    transmission: opts.transmission ?? 0, thickness: opts.thickness ?? 0,
    clearcoat: opts.clearcoat ?? 0.25, clearcoatRoughness: 0.35,
    depthWrite: opts.depthWrite ?? true
  });
  const descriptions = {
    'کپسول': ['لایه‌ای ژله‌ای بیرونی در برخی باکتری‌ها که به چسبیدن به سطوح و محافظت کمک می‌کند.', 'کپسول در همهٔ گونه‌های باکتریایی وجود ندارد و ترکیب آن اغلب پلی‌ساکاریدی است.'],
    'دیوارهٔ سلولی': ['لایه‌ای استحکام‌بخش که شکل باکتری را حفظ می‌کند و در برابر فشار اسمزی مقاومت ایجاد می‌کند.', 'دیوارهٔ بیشتر باکتری‌ها پپتیدوگلیکان دارد؛ آرایش آن در گرم‌مثبت و گرم‌منفی یکسان نیست.'],
    'غشای بیرونی': ['غشای ویژهٔ باکتری‌های گرم‌منفی که بیرون لایهٔ نازک پپتیدوگلیکان قرار دارد.', 'در غشای بیرونی گرم‌منفی‌ها لیپوپلی‌ساکارید وجود دارد؛ باکتری‌های گرم‌مثبت این غشا را ندارند.'],
    'غشای پلاسمایی': ['مرز انتخاب‌پذیر یاخته است و عبور مواد و بسیاری از فرایندهای انرژی‌زایی را تنظیم می‌کند.', 'از دولایهٔ فسفولیپیدی و پروتئین‌ها تشکیل شده است.'],
    'سیتوپلاسم': ['بخش آبی و ژله‌مانند داخل یاخته که ریبوزوم‌ها و مادهٔ ژنتیکی در آن قرار دارند.', 'بسیاری از واکنش‌های سوخت‌وسازی در سیتوپلاسم انجام می‌شوند.'],
    'ریبوزوم‌ها': ['ساختارهای بدون غشا که پروتئین‌ها را از روی پیام RNA می‌سازند.', 'ریبوزوم باکتریایی 70S است و از دو زیرواحد تشکیل می‌شود.'],
    'نوکلئوئید و DNA': ['ناحیه‌ای از سیتوپلاسم که کروموزوم اصلی باکتری در آن قرار دارد؛ غشای هسته‌ای آن را احاطه نمی‌کند.', 'ژنوم بسیاری از باکتری‌ها یک مولکول DNA دو‌رشته‌ای حلقوی است؛ استثناهایی هم وجود دارد.'],
    'پلاسمید': ['مولکول DNA کوچک‌تری که جدا از کروموزوم اصلی همانندسازی می‌کند.', 'برخی پلاسمیدها ژن‌های مقاومت دارویی یا ویژگی‌های سازگاری را حمل می‌کنند.'],
    'پیلی و فیمبریه': ['زوائد پروتئینی کوتاه سطحی که در اتصال به سطوح یا در برخی گونه‌ها در انتقال DNA نقش دارند.', 'فیمبریه معمولاً برای اتصال است؛ پیلی جنسی در کونژوگاسیون نقش دارد.'],
    'تاژک باکتریایی': ['رشتهٔ حرکتی که با موتور چرخان در غشای باکتری حرکت می‌کند.', 'تاژک باکتریایی از نظر ساختار با تاژک یوکاریوتی متفاوت است و همهٔ باکتری‌ها تاژک ندارند.'],
    'ژنوم ویروس': ['مادهٔ وراثتی ویروس که می‌تواند DNA یا RNA باشد.', 'ژنوم ویروس‌ها از نظر نوع، تعداد رشته و شکل سازمان‌یافتگی بسیار متنوع است.'],
    'کپسید پروتئینی': ['پوشش پروتئینی پیرامون ژنوم ویروس که از مادهٔ ژنتیکی محافظت می‌کند.', 'کپسید از زیرواحدهایی به نام کپسومر ساخته می‌شود.'],
    'پوشش لیپیدی': ['غشایی بیرونی در بعضی ویروس‌ها که هنگام خروج از سلول میزبان به دست می‌آید.', 'ویروس‌های بدون پوشش نیز وجود دارند؛ بنابراین این لایه ویژگی همهٔ ویروس‌ها نیست.'],
    'گلیکوپروتئین‌های سطحی': ['برآمدگی‌های پروتئینی یا قندی‌ـ‌پروتئینی که در اتصال ویروس به گیرنده‌های سلول میزبان نقش دارند.', 'شکل و نوع این مولکول‌ها در شناسایی میزبان و پاسخ ایمنی اهمیت دارد.'],
    'هیف': ['رشتهٔ لوله‌ای قارچ که رشد می‌کند و مواد غذایی را از محیط جذب می‌کند.', 'دیوارهٔ بسیاری از قارچ‌ها حاوی کیتین است.'],
    'میسلیوم': ['شبکهٔ به‌هم‌پیوستهٔ هیف‌ها که بخش رویشی قارچ را می‌سازد.', 'افزایش سطح میسلیوم به جذب بهتر مواد غذایی کمک می‌کند.'],
    'دیوارهٔ قارچی': ['پوشش محکم پیرامون سلول قارچی که شکل و حفاظت مکانیکی ایجاد می‌کند.', 'کیتین و گلوکان‌ها از اجزای مهم دیوارهٔ بسیاری از قارچ‌ها هستند.'],
    'هاگدان و هاگ': ['ساختار تولید هاگ در برخی قارچ‌ها؛ هاگ‌ها می‌توانند پراکنده شوند و در شرایط مناسب جوانه بزنند.', 'همهٔ قارچ‌ها هاگدان یکسان ندارند و روش‌های تولیدمثل قارچ‌ها متنوع است.'],
    'غشای یاخته': ['مرز زنده و انتخاب‌پذیر یاختهٔ آغازی است.', 'آغازیان یوکاریوت‌اند؛ شکل بدن و شیوهٔ تغذیهٔ آن‌ها بسیار متنوع است.'],
    'هسته': ['اندامک دارای پوشش دوغشایی که بیشتر DNA یاختهٔ یوکاریوتی را در خود جای می‌دهد.', 'منافذ هسته‌ای تبادل کنترل‌شدهٔ مولکول‌ها را ممکن می‌کنند.'],
    'واکوئول غذایی': ['کیسه‌ای غشادار که در برخی آغازیان برای هضم درون‌یاخته‌ای غذا تشکیل می‌شود.', 'در آمیب، واکوئول غذایی پس از بلع ذرهٔ غذا شکل می‌گیرد.'],
    'پای کاذب': ['برآمدگی موقتی سیتوپلاسم که در حرکت و گرفتن غذا در آمیب نقش دارد.', 'پای کاذب با تغییر جریان سیتوپلاسم و بازآرایی رشته‌های اکتین ایجاد می‌شود.'],
    'واکوئول انقباضی': ['در برخی آغازیان آب اضافی را جمع و به بیرون سلول دفع می‌کند.', 'در جانداران آب شیرین، این ساختار به تنظیم اسمزی کمک می‌کند.'],
    'میتوکندری': ['اندامک تنفس یاخته‌ای که بخش مهمی از ATP در آن تولید می‌شود.', 'غشای داخلی چین‌خورده است و چین‌ها را کریستا می‌نامند.'],
    'شبکهٔ آندوپلاسمی زبر': ['شبکه‌ای غشادار با ریبوزوم‌های متصل که در ساخت و انتقال بسیاری از پروتئین‌ها نقش دارد.', 'پروتئین‌های ترشحی و غشایی معمولاً وارد مسیر شبکهٔ زبر و دستگاه گلژی می‌شوند.'],
    'دستگاه گلژی': ['کیسه‌های غشادار روی‌هم‌چیده که پروتئین‌ها و لیپیدها را تغییر می‌دهند، مرتب می‌کنند و بسته‌بندی می‌کنند.', 'گلژی در مسیر ترشح و ساخت برخی وزیکول‌ها نقش دارد.'],
    'ریبوزوم': ['محل ترجمهٔ RNA پیام‌رسان و ساخت زنجیرهٔ پروتئینی.', 'ریبوزوم‌ها در سیتوپلاسم آزاد یا روی شبکهٔ آندوپلاسمی زبر قرار می‌گیرند.'],
    'غشای پلاسمایی جانوری': ['غشای انعطاف‌پذیر پیرامون یاختهٔ جانوری که تبادل مواد را تنظیم می‌کند.', 'غشای یاخته از دولایهٔ فسفولیپیدی و پروتئین‌ها تشکیل شده است.'],
    'دیوارهٔ سلولزی': ['لایهٔ بیرونی نسبتاً سخت که به یاختهٔ گیاهی شکل و استحکام می‌دهد.', 'سلولز پلی‌ساکارید اصلی دیوارهٔ یاخته‌های گیاهی است.'],
    'واکوئول مرکزی': ['فضای بزرگ غشادار ذخیره‌کنندهٔ آب و مواد محلول که به حفظ فشار تورژسانس کمک می‌کند.', 'واکوئول مرکزی در بسیاری از یاخته‌های بالغ گیاهی بخش بزرگی از حجم یاخته را اشغال می‌کند.'],
    'کلروپلاست': ['اندامک فتوسنتز در یاخته‌های گیاهی سبزینه‌دار؛ انرژی نور را به انرژی شیمیایی تبدیل می‌کند.', 'کلروفیل در غشاهای تیلاکوئیدی قرار دارد که روی هم گرانوم می‌سازند.']
  };
  const add = (name, object, override) => {
    const d = override || descriptions[name] || ['بخشی از ساختار زیستی که در این مدل نمایش داده شده است.', 'ابعاد و رنگ‌ها شماتیک‌اند و برای نمایش آموزشی تنظیم شده‌اند.'];
    object.traverse(o => { if (o.isMesh) { o.userData.part = name; o.castShadow = true; o.receiveShadow = true; } });
    object.userData.part = name;
    root.add(object);
    if (!parts[name]) parts[name] = { objects: [], desc: d[0], fact: d[1] };
    parts[name].objects.push(object);
    return object;
  };
  const mesh = (name, geometry, material, position = [0,0,0], scale = [1,1,1], rotation = [0,0,0]) => {
    const m = new THREE.Mesh(geometry, material);
    m.position.set(...position); m.scale.set(...scale); m.rotation.set(...rotation);
    return add(name, m);
  };
  const ball = (name, pos, scale, color, opts = {}) => mesh(name,
    new THREE.SphereGeometry(1, opts.seg || 40, opts.seg || 28),
    mat(color, opts.rough ?? 0.42, opts), pos, scale, opts.rot || [0,0,0]);
  const capsule = (name, pos, radius, length, color, axis = 'x', opts = {}) => {
    const g = new THREE.CapsuleGeometry(radius, length, 8, 28);
    const rot = axis === 'x' ? [0,0,Math.PI/2] : axis === 'z' ? [Math.PI/2,0,0] : [0,0,0];
    return mesh(name, g, mat(color, opts.rough ?? 0.42, opts), pos, [1,1,1], rot);
  };
  const rod = (name, a, b, radius, color, opts = {}) => {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const dir = end.clone().sub(start);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radius*0.82, radius, dir.length(), 12), mat(color, opts.rough ?? 0.4, opts));
    m.position.copy(start).add(end).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.normalize());
    return add(name, m);
  };
  const tube = (name, points, radius, color, opts = {}) => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    return mesh(name, new THREE.TubeGeometry(curve, Math.max(40, points.length*8), radius, 10, false), mat(color, opts.rough ?? 0.38, opts));
  };
  const helix = (name, center, radius, turns, height, tubeRadius, color) => {
    const pts = [];
    for (let i=0;i<=220;i++) { const t=i/220, a=t*turns*Math.PI*2; pts.push([center[0]+Math.cos(a)*radius, center[1]+(t-.5)*height, center[2]+Math.sin(a)*radius]); }
    return tube(name, pts, tubeRadius, color);
  };
  const clear = () => {
    while (root.children.length) {
      const o = root.children[0]; root.remove(o);
      o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) { if (Array.isArray(x.material)) x.material.forEach(m=>m.dispose()); else x.material.dispose(); } });
    }
    parts = {};
  };
  const configs = {
    bacteria: { title: 'BACTERIUM · باکتری میله‌ای گرم‌منفی', fact: 'این مدل یک باکتری میله‌ای گرم‌منفی را به‌صورت شماتیک نشان می‌دهد. باکتری‌های واقعی از نظر شکل، دیواره، زوائد و آرایش ژنوم تنوع زیادی دارند.', build() {
      capsule('کپسول',[0,0,0],0.78,2.7,0x8dc9b7,'x',{transparent:true,opacity:.24,rough:.3});
      capsule('غشای بیرونی',[0,0,0],0.68,2.55,0xd8a84f,'x',{transparent:true,opacity:.3,rough:.25});
      capsule('دیوارهٔ سلولی',[0,0,0],0.59,2.45,0xe7d28a,'x',{transparent:true,opacity:.46,rough:.35});
      capsule('غشای پلاسمایی',[0,0,0],0.51,2.35,0x4ca9a0,'x',{transparent:true,opacity:.62,rough:.28});
      capsule('سیتوپلاسم',[0,0,0],0.44,2.28,0xd89a68,'x',{rough:.5});
      // Fine membrane beads and wall texture
      for(let layer=0;layer<3;layer++) for(let i=0;i<54;i++){
        const a=i*Math.PI*2/54, x=Math.cos(a)*(0.54+layer*.065), z=Math.sin(a)*(0.54+layer*.065);
        ball(layer===0?'غشای پلاسمایی':layer===1?'دیوارهٔ سلولی':'غشای بیرونی',[Math.cos(a)*1.0,x*.1,z],[.035,.045,.035],layer===0?0x245e62:layer===1?0xb18b45:0x8d6d3b,{seg:10,rough:.3});
      }
      // Nucleoid as a tangled chromosome loop
      const dnaPts=[]; for(let i=0;i<=260;i++){const t=i/260,a=t*Math.PI*8;dnaPts.push([-0.55+Math.cos(a)*(.35+.12*Math.sin(a*2)),Math.sin(a*2.7)*.23,Math.sin(a)*.3]);}
      tube('نوکلئوئید و DNA',dnaPts,.035,0x743d9b);
      for(let i=0;i<3;i++){const a=i*2.1;const pts=[];for(let j=0;j<=80;j++){const t=j/80,ang=t*Math.PI*2;pts.push([.65+Math.cos(ang)*(.12+i*.035),-.22+i*.18+Math.sin(ang)*.08,.18+Math.sin(ang)*(.1+i*.025)]);}tube('پلاسمید',pts,.025,0xe45c55);}
      // Ribosomes dispersed in cytosol
      for(let i=0;i<68;i++){const x=(Math.random()-.5)*2.6,y=(Math.random()-.5)*.56,z=(Math.random()-.5)*.5;if((x/1.5)**2+(y/.52)**2+(z/.5)**2<.86)ball('ریبوزوم‌ها',[x,y,z],[.045,.045,.045],0x344d87,{seg:10,rough:.3});}
      // Pili / fimbriae around cell
      for(let i=0;i<28;i++){const a=i*Math.PI*2/28, x=Math.cos(a),z=Math.sin(a);const start=[x*1.35,Math.sin(i*2)*.12,z*.58],end=[x*(1.72+(i%3)*.12),.15*Math.cos(i),z*(.82+(i%2)*.1)];tube('پیلی و فیمبریه',[start,[start[0]*1.1,.08+start[1],start[2]*1.1],end],.018,0xd6c99d);}
      // Long rotating flagellum
      const flag=[];for(let i=0;i<=160;i++){const t=i/160;flag.push([1.5+2.2*t, .2+Math.sin(t*13)*.25, .15+Math.cos(t*13)*.25]);}
      tube('تاژک باکتریایی',flag,.045,0x83c7e4);
      // LPS-like surface knobs on the outer envelope
      for(let i=0;i<70;i++){const a=i*2.399, y=-.65+(i%14)*.1, r=.72;const x=Math.cos(a)*r,z=Math.sin(a)*r;rod('غشای بیرونی',[x,y,z],[x*1.12,y+.1,z*1.12],.018,0xd4b66d);}
    }},
    virus: { title: 'VIRION · ویروس پوشش‌دار', fact: 'مدل نمایشی یک ویروس پوشش‌دار کروی است. ویروس‌ها از نظر شکل کپسید، ژنوم، پوشش و پروتئین‌های سطحی بسیار متنوع‌اند.', build() {
      ball('پوشش لیپیدی',[0,0,0],[1.42,1.42,1.42],0x719bd6,{transparent:true,opacity:.22,rough:.22});
      ball('کپسید پروتئینی',[0,0,0],[1.03,1.03,1.03],0x3d9f9b,{transparent:true,opacity:.55,rough:.32});
      // Icosahedral capsomer pattern
      const ico = new THREE.IcosahedronGeometry(.98,2);
      const capMat = mat(0x4eb6a6,.35);
      const caps = new THREE.Mesh(ico,capMat); add('کپسید پروتئینی',caps);
      // Genome coil inside capsid
      const gen=[];for(let i=0;i<=300;i++){const t=i/300,a=t*Math.PI*12;gen.push([Math.cos(a)*(.35+.12*Math.sin(a*3)),(t-.5)*1.2,Math.sin(a)*(.35+.12*Math.cos(a*2))]);}
      tube('ژنوم ویروس',gen,.035,0xf0c45f);
      // Envelope glycoprotein spikes distributed on sphere
      for(let i=0;i<36;i++){
        const y=1-2*(i+.5)/36, r=Math.sqrt(1-y*y), a=i*2.399, n=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);
        const base=n.clone().multiplyScalar(1.28), tip=n.clone().multiplyScalar(1.68);
        rod('گلیکوپروتئین‌های سطحی',base.toArray(),tip.toArray(),.065,0xe99b70);
        ball('گلیکوپروتئین‌های سطحی',tip.toArray(),[.105,.105,.105],0xf3c28c,{seg:16});
        const foot=n.clone().multiplyScalar(1.22);
        ball('پوشش لیپیدی',foot.toArray(),[.055,.055,.055],0xb5c9f2,{seg:12});
      }
    }},
    fungus: { title: 'FILAMENTOUS FUNGUS · قارچ رشته‌ای', fact: 'این مدل یک قارچ رشته‌ای را نشان می‌دهد. قارچ‌ها یوکاریوت و دگرپروردند؛ دیوارهٔ بسیاری از آن‌ها کیتین دارد و مواد غذایی را جذب می‌کنند.', build() {
      // Branched hyphae network
      const paths = [
        [[-1.7,-1.7,0],[-1.25,-1.2,.1],[-.8,-.8,.05],[-.25,-.35,.2],[.35,.1,.1],[.85,.65,.2],[1.3,1.15,.15]],
        [[-.8,-.8,.05],[-1.1,-.3,.3],[-1.25,.2,.35],[-1.15,.8,.2]],
        [[.35,.1,.1],[.1,.55,-.25],[.05,1.1,-.3],[.35,1.55,-.25]],
        [[.85,.65,.2],[1.25,.45,-.2],[1.65,.25,-.35]],
        [[-.25,-.35,.2],[-.55,-.65,.6],[-.7,-1.2,.8]],
        [[-1.25,-1.2,.1],[-1.55,-.9,-.35],[-1.7,-.3,-.45]]
      ];
      paths.forEach(p=>tube('هیف',p,.105,0xe4d0a2));
      // Septa rings and wall bands
      paths.forEach(path=>path.slice(1,-1).forEach(p=>ball('دیوارهٔ قارچی',p,[.13,.13,.13],0xc9ad79,{seg:14})));
      // Upright reproductive stalk and sporangium
      rod('هاگدان و هاگ',[.35,1.55,-.25],[.35,2.15,-.25],.055,0xb8d0a2);
      ball('هاگدان و هاگ',[.35,2.35,-.25],[.34,.43,.34],0xc97862,{rough:.48});
      for(let i=0;i<26;i++){const a=i*2.399,y=2.3+Math.sin(i*4)*.34,r=.38;ball('هاگدان و هاگ',[.35+Math.cos(a)*r,y,-.25+Math.sin(a)*r],[.055,.055,.055],0xf0d7a6,{seg:10});}
      // Mycelial substrate branches
      for(let i=0;i<18;i++){const a=i*2.4, x=Math.cos(a)*1.3,z=Math.sin(a)*.7; tube('میسلیوم',[[0,-1.7,0],[x*.5,-1.9,z*.5],[x,-1.72,z]],.045,0x86ae91);}
    }},
    protist: { title: 'AMOEBA · آمیب', fact: 'آمیب یک آغازی تک‌یاخته‌ای یوکاریوت است. شکل آن پیوسته تغییر می‌کند و با پای کاذب حرکت و غذاگیری انجام می‌دهد.', build() {
      // Irregular amoeboid outline
      const shapePts=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2,r=1.15+.18*Math.sin(a*3)+.11*Math.cos(a*5);shapePts.push(new THREE.Vector2(Math.cos(a)*r,Math.sin(a)*r));}
      const shape = new THREE.Shape(shapePts); const geo = new THREE.ExtrudeGeometry(shape,{depth:.42,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.12,bevelThickness:.12,curveSegments:12});
      mesh('غشای یاخته',geo,mat(0x64b9a2,.34,{transparent:true,opacity:.56}),[-.2,-.5,-.2],[1,1,1],[0,0,0]);
      ball('هسته',[.12,.05,.12],[.42,.45,.36],0x7957a8,{rough:.32});
      ball('واکوئول انقباضی',[-.63,.38,.18],[.19,.19,.19],0xd4e9f1,{transparent:true,opacity:.7});
      for(let i=0;i<6;i++){const a=i*Math.PI/3;ball('واکوئول غذایی',[Math.cos(a)*.72,Math.sin(a)*.48,.4],[.13,.14,.13],0xe5bd69,{seg:18});}
      // Pseudopodia extensions
      const arms=[[[.75,.35,.05],[1.12,.65,.05],[1.55,.82,.02]], [[-.8,.4,.1],[-1.12,.8,.1],[-1.48,1.05,.08]], [[-.6,-.55,.1],[-.95,-.85,.1],[-1.18,-1.2,.08]], [[.45,-.65,.1],[.72,-.98,.1],[1.05,-1.25,.08]]];
      arms.forEach(a=>tube('پای کاذب',a,.19,0x65b8a0));
      // Cytoplasmic granules
      for(let i=0;i<35;i++){const a=i*2.4,r=.25+(i%5)*.12;ball('سیتوپلاسم',[Math.cos(a)*r,Math.sin(a)*r,.48],[.025,.025,.025],0x8d6656,{seg:8});}
    }},
    animal: { title: 'ANIMAL CELL · یاختهٔ جانوری', fact: 'این مدل یک یاختهٔ جانوری یوکاریوتی را نشان می‌دهد. یاختهٔ جانوری دیوارهٔ سلولی و کلروپلاست ندارد؛ شکل واقعی یاخته‌ها بسته به بافت متفاوت است.', build() {
      ball('غشای پلاسمایی جانوری',[0,0,0],[1.72,1.22,1.05],0x5aa9a2,{transparent:true,opacity:.28,rough:.22});
      ball('سیتوپلاسم',[0,0,0],[1.58,1.1,.94],0xd9a36e,{transparent:true,opacity:.3});
      ball('هسته',[.05,.1,.05],[.58,.62,.55],0x7954a5,{rough:.3});
      ball('هستک',[.18,.17,.42],[.18,.19,.16],0x4a2f78,{rough:.3});
      // Nuclear pores
      for(let i=0;i<16;i++){const a=i*2.399,y=Math.sin(a*2)*.45,z=Math.cos(a)*.48;ball('هسته',[.05+Math.cos(a)*.57,y+.1,z],[.035,.035,.035],0xc5a6e6,{seg:10});}
      // Mitochondria with cristae
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3, x=Math.cos(a)*1.03,y=Math.sin(a)*.63;
        const group=new THREE.Group();group.position.set(x,y,.12);group.rotation.z=a*.35;
        const body=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),mat(0xc65d4f,.36));body.scale.set(.34,.19,.18);group.add(body);
        for(let j=0;j<5;j++){const cr=new THREE.Mesh(new THREE.TorusGeometry(.105,.018,6,18,Math.PI*1.25),mat(0xf3b18a,.4));cr.position.set(-.16+j*.07,0,.17);cr.rotation.y=Math.PI/2;group.add(cr);}
        add('میتوکندری',group);
      }
      // Rough ER with ribosomes around nucleus
      for(let k=0;k<5;k++){const y=.38-k*.19, pts=[];for(let j=0;j<=40;j++){const t=j/40,a=t*Math.PI*2;pts.push([Math.cos(a)*(.75+.05*Math.sin(a*4)),y+.07*Math.sin(a*3),Math.sin(a)*.62]);}tube('شبکهٔ آندوپلاسمی زبر',pts,.045,0x5d8ca4);}
      for(let i=0;i<65;i++){const a=i*2.399,r=.76+(i%4)*.05;ball('ریبوزوم',[Math.cos(a)*r,Math.sin(a*1.3)*.72,Math.sin(a)*.62],[.025,.025,.025],0x283f78,{seg:8});}
      // Golgi cisternae
      for(let k=0;k<5;k++){const g=new THREE.Mesh(new THREE.TorusGeometry(.36-k*.025,.045,8,40,Math.PI*1.65),mat(0xe6b75d,.42));g.position.set(-.85,.12-k*.13,-.25);g.rotation.x=Math.PI/2;add('دستگاه گلژی',g);}
      for(let i=0;i<9;i++){const a=i*2.4;ball('دستگاه گلژی',[ -.85+Math.cos(a)*.48,.12+Math.sin(a)*.38,-.2],[.07,.07,.07],0xe8ca82,{seg:12});}
      // Lysosomes / vesicles
      for(let i=0;i<7;i++){const a=i*2.4;ball('وزیکول و لیزوزوم',[Math.cos(a)*1.22,Math.sin(a)*.85,.55],[.09,.09,.09],0xd5cf7d,{seg:14});}
    }},
    plant: { title: 'PLANT CELL · یاختهٔ گیاهی', fact: 'مدل یک یاختهٔ گیاهی سبزینه‌دار را نشان می‌دهد. یاختهٔ گیاهی دیوارهٔ سلولزی، واکوئول بزرگ و معمولاً کلروپلاست دارد؛ همهٔ یاخته‌های گیاه کلروپلاست ندارند.', build() {
      mesh('دیوارهٔ سلولزی',new THREE.BoxGeometry(3.55,2.45,2.0),mat(0xc5a96b,.5),[0,0,0]);
      mesh('غشای پلاسمایی',new THREE.BoxGeometry(3.35,2.25,1.8),mat(0x4b9d94,.35,{transparent:true,opacity:.38}),[0,0,0]);
      ball('واکوئول مرکزی',[0,-.05,-.02],[1.08,.91,.68],0x79aeda,{transparent:true,opacity:.54,rough:.24});
      ball('هسته',[1.05,.63,.32],[.39,.42,.35],0x7954a5,{rough:.32});
      ball('هستک',[1.12,.66,.62],[.12,.13,.1],0x4a2f78);
      // Chloroplasts with grana stacks
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4,x=Math.cos(a)*1.18,y=Math.sin(a)*.75,z=.48;
        const g=new THREE.Group();g.position.set(x,y,z);g.rotation.z=a*.3;
        const body=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),mat(0x3c925c,.36));body.scale.set(.34,.18,.13);g.add(body);
        for(let j=0;j<5;j++){const disk=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.025,16),mat(0x9bd47e,.4));disk.position.set(-.2+j*.09,0,.12);g.add(disk);}
        add('کلروپلاست',g);
      }
      // Plasmodesmata shown as small channels in wall
      for(let i=0;i<14;i++){const a=i*2.399,x=Math.cos(a)*1.7,y=Math.sin(a)*1.1;rod('دیوارهٔ سلولزی',[x,y,-.25],[x,y,.25],.025,0x7c643d);}
    }}
  };

  function selectPart(name) {
    const p = parts[name]; if (!p) return;
    document.getElementById('lifePartTitle').textContent = name;
    document.getElementById('lifePartText').textContent = p.desc;
    document.getElementById('lifeFact').textContent = 'نکتهٔ علمی: ' + p.fact;
    document.querySelectorAll('#lifeParts button').forEach(b => b.classList.toggle('active', b.dataset.part === name));
    Object.entries(parts).forEach(([key, value]) => value.objects.forEach(obj => obj.traverse(o => {
      if (o.isMesh && o.material && o.material.emissive) { o.material.emissive.set(key === name ? 0x4a3820 : 0x000000); o.material.emissiveIntensity = key === name ? .48 : 0; }
    })));
  }
  function build(type) {
    currentType = type; clear(); cut = false;
    const cfg = configs[type]; cfg.build();
    document.getElementById('lifeType').textContent = cfg.title;
    document.getElementById('lifeFact').textContent = 'نکتهٔ علمی: ' + cfg.fact;
    const box = document.getElementById('lifeParts');
    box.innerHTML = Object.keys(parts).map(name => '<button type="button" data-part="' + name + '">' + name + '</button>').join('');
    box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => selectPart(b.dataset.part)));
    selectPart(Object.keys(parts)[0]);
    camera.position.set(6.5,4.5,7.5); controls.target.set(0,0,0); controls.update();
    document.querySelectorAll('#lifeTabs button').forEach(b => b.classList.toggle('active', b.dataset.life === type));
    const cutBtn = document.getElementById('lifeCut'); cutBtn.textContent = 'نمای برش‌خورده';
  }
  document.getElementById('lifeTabs').querySelectorAll('button').forEach(b => b.addEventListener('click', () => build(b.dataset.life)));
  document.getElementById('lifeReset').onclick = () => { camera.position.set(6.5,4.5,7.5); controls.target.set(0,0,0); controls.update(); };
  document.getElementById('lifeSpin').onclick = e => { spin = !spin; e.currentTarget.textContent = spin ? 'توقف چرخش' : 'چرخش خودکار'; };
  document.getElementById('lifeCut').onclick = e => {
    cut = !cut;
    const outer = currentType === 'bacteria' ? ['کپسول','غشای بیرونی','دیوارهٔ سلولی'] :
      currentType === 'virus' ? ['پوشش لیپیدی','کپسید پروتئینی'] :
      currentType === 'animal' ? ['غشای پلاسمایی جانوری'] :
      currentType === 'plant' ? ['دیوارهٔ سلولزی','غشای پلاسمایی'] :
      currentType === 'protist' ? ['غشای یاخته'] : ['دیوارهٔ قارچی'];
    outer.forEach(n => (parts[n]?.objects || []).forEach(obj => obj.visible = !cut));
    e.currentTarget.textContent = cut ? 'بازگشت لایه‌ها' : 'نمای برش‌خورده';
  };
  renderer.domElement.addEventListener('pointerup', e => {
    if (e.pointerType === 'touch' && e.detail === 0) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(root.children, true).find(h => h.object.userData.part);
    if (hit) selectPart(hit.object.userData.part);
  });
  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w,h,false); camera.aspect = w/h; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host); resize();
  const clock = new THREE.Clock();
  function animate() { requestAnimationFrame(animate); if (spin) root.rotation.y += .0024; controls.update(); renderer.render(scene,camera); }
  animate();
  build('bacteria');
};
