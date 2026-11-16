/* BIOLOGY X major upgrade v2 — educational models, not measured lab data */
(function(){
'use strict';
const $=s=>document.querySelector(s), fa=n=>String(n).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]), norm=s=>String(s).replace(/[يى]/g,'ی').replace(/ك/g,'ک').toLowerCase();
const terms=[
['آوند چوبی','بافت رسانای انتقال آب و یون‌های معدنی از ریشه به اندام‌های هوایی.','فصل ۱۲'],
['آوند آبکش','بافت رسانای جابه‌جایی قندها و دیگر مواد آلی میان اندام‌های گیاه.','فصل ۱۲'],
['آوند','بافت لوله‌ای گیاه برای انتقال آب، مواد معدنی یا مواد آلی.','فصل ۱۲'],
['آغازیان','گروهی متنوع از یوکاریوت‌ها؛ بسیاری تک‌یاخته‌ای و آبزی‌اند.','فصل ۱۱'],
['آمیب','آغازی تک‌یاخته‌ای که با پای کاذب حرکت و ذرات غذا را می‌گیرد.','فصل ۱۱'],
['اندام','ساختاری متشکل از چند بافت هماهنگ با وظیفه‌ای مشخص.','فصل ۱۲'],
['اندامک','ساختار تخصص‌یافتهٔ درون یاخته که کار مشخصی انجام می‌دهد.','فصل ۱۱'],
['انگل','جانداری که از میزبان سود می‌برد و معمولاً به آن زیان می‌رساند.','فصل ۱۵'],
['انگل‌گرایی','رابطه‌ای که در آن انگل سود و میزبان زیان می‌برد.','فصل ۱۵'],
['انقراض','از بین رفتن کامل همهٔ افراد یک گونه.','فصل ۱۵'],
['بافت','مجموعه‌ای از یاخته‌های هماهنگ با کارکرد مشترک.','فصل ۱۲'],
['باکتری','جاندار تک‌یاخته‌ای پروکاریوت که هستهٔ غشادار ندارد.','فصل ۱۱'],
['بازدانگان','گیاهان دانه‌داری که دانه درون تخمدان و میوه محصور نیست.','فصل ۱۲'],
['بندپا','بی‌مهره‌ای با اسکلت خارجی، بدن بندبند و زوائد مفصلی.','فصل ۱۳'],
['بوم‌سازگان','جانداران یک ناحیه، عوامل غیرزنده و روابط میان آن‌ها.','فصل ۱۵'],
['بوم‌شناسی','مطالعهٔ روابط جانداران با یکدیگر و با محیط.','فصل ۱۵'],
['پای کاذب','برآمدگی موقت سیتوپلاسم برای حرکت و گرفتن غذا در برخی آغازیان.','فصل ۱۱'],
['پروکاریوت','یاخته‌ای فاقد هستهٔ محصور در غشا و اندامک‌های غشادار معمول یوکاریوتی.','فصل ۱۱'],
['پروتئین','مولکول ساخته‌شده از آمینواسیدها با نقش‌های ساختاری، آنزیمی و انتقالی.','عمومی'],
['تار کشنده','ساختار باریک ریشه که سطح جذب آب و یون‌ها را افزایش می‌دهد.','فصل ۱۲'],
['تولیدکننده','جانداری که مواد آلی را از مواد ساده‌تر می‌سازد؛ مانند گیاه.','فصل ۱۵'],
['تولیدمثل','فرایندی که به ایجاد افراد جدید و تداوم نسل می‌انجامد.','عمومی'],
['تولیدمثل جنسی','تولیدمثل با مشارکت گامت‌ها یا هسته‌های جنسی.','فصل ۱۲'],
['تولیدمثل غیرجنسی','تولیدمثل بدون لقاح؛ فرزندان معمولاً به والد از نظر ژنتیکی نزدیک‌اند.','فصل ۱۱'],
['تجزیه‌کننده','جانداری مانند بسیاری قارچ‌ها و باکتری‌ها که مواد آلی مرده را تجزیه می‌کند.','فصل ۱۵'],
['تنوع زیستی','گوناگونی ژن‌ها، گونه‌ها و بوم‌سازگان‌ها.','فصل ۱۵'],
['تنفس یاخته‌ای','واکنش‌هایی که انرژی مواد غذایی را برای ساخت ATP در دسترس یاخته می‌گذارند.','فراتر از کتاب'],
['جاندار یوکاریوت','جانداری با یاخته‌های دارای هستهٔ غشادار.','فصل ۱۱'],
['جلبک','نام عمومی گروه‌های متنوع فتوسنتزکننده، عمدتاً آبزی؛ نه یک گروه خویشاوند واحد.','فصل ۱۱'],
['چرخهٔ مواد','گردش عناصر میان جانداران و محیط.','فصل ۱۵'],
['حشره','بندپایی با سه بخش اصلی بدن و سه جفت پا.','فصل ۱۳'],
['خزه','گیاه کوچک بدون آوند حقیقی که با هاگ تولیدمثل می‌کند.','فصل ۱۲'],
['دانه','ساختاری شامل جنین گیاه و پوشش محافظ، همراه با ذخیره یا بافت تغذیه‌ای.','فصل ۱۲'],
['دگرپرورد','جانداری که مواد آلی آماده را از محیط یا جانداران دیگر می‌گیرد.','فصل ۱۱'],
['دگردیسی','تغییر شکل و ساختار بدن در مراحل رشد، مانند لارو به بالغ.','فصل ۱۳'],
['دیوارهٔ یاخته‌ای','لایه‌ای بیرون غشای یاخته برای حفاظت و استحکام.','فصل ۱۱'],
['رابطهٔ همیاری','رابطه‌ای که هر دو جاندار سود می‌برند؛ مانند گل و گرده‌افشان.','فصل ۱۵'],
['ریبوزوم','ساختاری که ترجمهٔ RNA و ساخت پروتئین در آن انجام می‌شود.','فصل ۱۱'],
['ریشه','اندام گیاهی برای نگهداری گیاه و جذب آب و یون‌های معدنی.','فصل ۱۲'],
['زیستگاه','محیطی که جاندار در آن زندگی می‌کند.','فصل ۱۵'],
['زیست‌کره','همهٔ بخش‌های زمین که حیات در آن‌ها وجود دارد.','فصل ۱۵'],
['سازگاری','ویژگی وراثتی که در شرایط معین می‌تواند به بقا یا تولیدمثل کمک کند.','فراتر از کتاب'],
['ستون مهره','بخشی از اسکلت مهره‌داران که از نخاع محافظت می‌کند.','فصل ۱۴'],
['سیتوپلاسم','محتوای درون یاخته درون غشای پلاسمایی، به‌جز هسته در تعریف رایج.','فصل ۱۱'],
['سرخس','گیاه آونددار بدون دانه که با هاگ تولیدمثل می‌کند.','فصل ۱۲'],
['شبکهٔ غذایی','مجموعه‌ای از زنجیره‌های غذایی به‌هم‌پیوسته.','فصل ۱۵'],
['شکارچی','جانداری که جاندار دیگری را شکار و مصرف می‌کند.','فصل ۱۵'],
['غشای پلاسمایی','مرز انتخاب‌پذیر یاخته از دولایهٔ فسفولیپیدی و پروتئین‌ها.','فصل ۱۱'],
['فتوسنتز','ساخت مواد آلی از مواد ساده با استفاده از انرژی نور.','فصل ۱۲'],
['فشار تورژسانس','فشار محتویات یاخته بر دیواره که به استحکام یاختهٔ گیاهی کمک می‌کند.','فراتر از کتاب'],
['قارچ','یوکاریوت دگرپرورد که مواد غذایی را جذب می‌کند؛ دیوارهٔ بسیاری از آن‌ها کیتین دارد.','فصل ۱۱'],
['گونه','در تعریف رایج، جمعیت‌هایی که در طبیعت می‌توانند زاده‌های بارور ایجاد کنند؛ این تعریف برای همهٔ جانداران مناسب نیست.','فصل ۱۱'],
['گامت','یاخته یا هستهٔ جنسی شرکت‌کننده در تولیدمثل جنسی.','فصل ۱۲'],
['گرده','ساختار تولیدشده در بساک که در انتقال بخش نرینگی تولیدمثل گیاهان دانه‌دار نقش دارد.','فصل ۱۲'],
['گرده‌افشانی','انتقال دانهٔ گرده از بساک به کلاله در گیاهان گل‌دار.','فصل ۱۲'],
['گیاه','یوکاریوتی که بسیاری از اعضای آن فتوسنتز می‌کنند و یاخته‌هایشان معمولاً دیوارهٔ سلولزی دارد.','فصل ۱۲'],
['لارو','مرحلهٔ نابالغ در چرخهٔ زندگی برخی جانوران.','فصل ۱۳'],
['لقاح','پیوند گامت‌ها یا هسته‌های جنسی برای آغاز رشد زیگوت.','فصل ۱۲'],
['مادهٔ وراثتی','مولکولی برای ذخیره و انتقال اطلاعات ژنتیکی؛ در جانداران معمولاً DNA.','فصل ۱۱'],
['مهره‌دار','جانوری دارای ستون مهره؛ ماهی، دوزیست، خزنده، پرنده و پستاندار.','فصل ۱۴'],
['مخروط','اندام تولیدمثلی بسیاری از بازدانگان.','فصل ۱۲'],
['مخمر','قارچ تک‌یاخته‌ای؛ برخی گونه‌ها در تخمیر کاربرد دارند.','فصل ۱۱'],
['مژک','زائدهٔ کوتاه سطح یاخته برای حرکت یا جابه‌جایی مواد.','فصل ۱۱'],
['میتوکندری','اندامک یوکاریوتی که بخش مهمی از ATP در تنفس هوازی در آن ساخته می‌شود.','فراتر از کتاب'],
['میسلیوم','شبکهٔ هیف‌ها که بخش رویشی بسیاری از قارچ‌های رشته‌ای را می‌سازد.','فصل ۱۱'],
['نهاندانگان','گیاهان گل‌داری که تخمک درون تخمدان است و دانه معمولاً درون میوه قرار می‌گیرد.','فصل ۱۲'],
['نوکلئوئید','ناحیهٔ بدون غشای هسته‌ای در پروکاریوت‌ها که DNA اصلی در آن قرار دارد.','فصل ۱۱'],
['واکوئول','کیسهٔ غشادار برای ذخیره یا جابه‌جایی آب و مواد.','فصل ۱۱'],
['واکوئول انقباضی','ساختاری در برخی آغازیان آب شیرین برای دفع آب اضافی.','فصل ۱۱'],
['ویروس','عامل غیرسلولی دارای ژنوم و پوشش پروتئینی؛ تکثیر آن به سلول میزبان وابسته است.','فصل ۱۱'],
['یاخته','کوچک‌ترین واحد ساختاری و کارکردی جانداران.','فصل ۱۱'],
['یوکاریوت','یاخته یا جانداری که هستهٔ محصور در غشا دارد.','فصل ۱۱'],
['آبشش','اندام تبادل گاز در بسیاری جانوران آبزی.','فصل ۱۴'],
['اسکلت خارجی','پوشش سخت بیرونی برای حفاظت و پشتیبانی؛ در بندپایان دیده می‌شود.','فصل ۱۳'],
['استخوان','بافت همبند سخت و زنده برای پشتیبانی، حفاظت و ذخیرهٔ مواد معدنی.','فصل ۱۴'],
['بی‌مهره','جانوری بدون ستون مهره؛ عنوانی برای جانوران بسیار متنوع.','فصل ۱۳'],
['پستاندار','مهره‌داری که ماده‌هایش غدد شیری دارند و مو یا کرک در بخشی از زندگی دیده می‌شود.','فصل ۱۴'],
['پرنده','مهره‌داری دارای پر و منقار؛ اندام جلویی آن به بال تبدیل شده است.','فصل ۱۴'],
['خزنده','مهره‌داری با پوست دارای پولک یا صفحات شاخی؛ پرندگان از نظر تکاملی درون خزندگان‌اند.','فصل ۱۴'],
['دوزیست','مهره‌داری که بسیاری گونه‌هایش بخشی از چرخهٔ زندگی را در آب و بخشی را در خشکی می‌گذرانند.','فصل ۱۴'],
['ماهی','مهره‌دار آبزی که معمولاً با آبشش تنفس می‌کند و غالباً باله دارد.','فصل ۱۴'],
['نرم‌تن','بی‌مهره‌ای با بدن نرم؛ حلزون، دوکفه‌ای و سرپاوران از آن‌اند.','فصل ۱۳'],
['اسفنج','جانور آبزی ساده‌ای که آب را از منافذ بدن عبور می‌دهد و ذرات را پالایش می‌کند.','فصل ۱۳'],
['کیسه‌تنان','بی‌مهرگان آبزی مانند عروس دریایی با سلول‌های گزنده.','فصل ۱۳'],
['کرم حلقوی','بی‌مهره‌ای با بدن بندبند حلقه‌مانند؛ کرم خاکی نمونه است.','فصل ۱۳'],
['خارپوست','بی‌مهرهٔ دریازی مانند ستارهٔ دریایی با دستگاه آب‌آوندی.','فصل ۱۳'],
['همسفرگی','رابطه‌ای که یک جاندار سود می‌برد و دیگری معمولاً اثر آشکاری نمی‌پذیرد.','فصل ۱۵'],
['رقابت','برهم‌کنش برای منبع محدود مانند غذا، نور، آب یا فضا.','فصل ۱۵'],
['هرم انرژی','نمایش انرژی قابل انتقال در سطوح غذایی که معمولاً در سطوح بالاتر کاهش می‌یابد.','فصل ۱۵'],
['سطح غذایی','جایگاه جاندار در مسیر انتقال انرژی از راه تغذیه.','فصل ۱۵'],
['جمعیت','افراد یک گونه در زمان و مکان معین.','فصل ۱۵'],
['جامعهٔ زیستی','همهٔ جمعیت‌های گونه‌های مختلف در یک ناحیه.','فصل ۱۵'],
['عامل غیرزنده','بخش فیزیکی یا شیمیایی محیط مانند نور، دما، آب و خاک.','فصل ۱۵'],
['عامل زنده','جاندار یا اثر ناشی از جانداران در یک بوم‌سازگان.','فصل ۱۵'],
['روزنه','منافذ ریز برگ که با یاخته‌های نگهبان تنظیم می‌شوند و در تبادل گاز و تعرق نقش دارند.','فصل ۱۲'],
['تعرق','از دست رفتن آب به شکل بخار، عمدتاً از برگ‌ها از راه روزنه‌ها.','فصل ۱۲'],
['کلاله','بخش مادگی گل که دانهٔ گرده را دریافت می‌کند.','فصل ۱۲'],
['خامه','بخشی از مادگی که کلاله را به تخمدان متصل می‌کند.','فصل ۱۲'],
['تخمدان گل','بخش مادگی که تخمک‌ها درون آن قرار دارند و معمولاً پس از لقاح به میوه تبدیل می‌شود.','فصل ۱۲'],
['بساک','بخشی از پرچم که دانه‌های گرده در آن ساخته می‌شوند.','فصل ۱۲'],
['کاسبرگ','بخش بیرونی گل که معمولاً از غنچه محافظت می‌کند.','فصل ۱۲'],
['گلبرگ','بخش گل که در بسیاری گیاهان به جذب گرده‌افشان کمک می‌کند.','فصل ۱۲'],
['پرچم','اندام تولیدکنندهٔ گرده در گل.','فصل ۱۲'],
['مادگی','اندام تولیدمثلی مادهٔ گل شامل کلاله، خامه و تخمدان.','فصل ۱۲'],
['کیتین','پلی‌ساکارید ساختاری در دیوارهٔ بسیاری قارچ‌ها و اسکلت خارجی بندپایان.','فراتر از کتاب'],
['کلروفیل','رنگیزهٔ سبز فتوسنتزی که انرژی نور را جذب می‌کند.','فصل ۱۲'],
['کلروپلاست','اندامک فتوسنتز در یاخته‌های گیاهی و برخی جلبک‌ها.','فصل ۱۲'],
['کربن‌دی‌اکسید','گازی که گیاهان در فتوسنتز مصرف می‌کنند و در تنفس آزاد می‌شود.','فصل ۱۲'],
['اکسیژن','گازی که در فتوسنتز اکسیژن‌زا آزاد می‌شود و بسیاری جانداران در تنفس هوازی مصرف می‌کنند.','فصل ۱۲'],
['ATP','مولکول انتقال‌دهندهٔ انرژی قابل استفاده در بسیاری فرایندهای یاخته‌ای.','فراتر از کتاب'],
['آنزیم','کاتالیزگر زیستی که سرعت واکنش را افزایش می‌دهد و در پایان خالص مصرف نمی‌شود.','فراتر از کتاب'],
['هم‌ایستایی','حفظ شرایط داخلی بدن در محدوده‌ای مناسب با وجود تغییرات محیط.','فراتر از کتاب'],
['گردش خون','حرکت خون برای انتقال گازها، مواد غذایی و مواد دفعی.','فصل ۱۴'],
['دستگاه عصبی','شبکه‌ای برای دریافت محرک و هماهنگی پاسخ‌ها.','فراتر از کتاب'],
['ظرفیت برد','اندازهٔ جمعیتی که محیط در شرایط معین می‌تواند در بلندمدت پشتیبانی کند.','فراتر از کتاب'],
['گونهٔ بومی','گونه‌ای که به‌طور طبیعی در یک منطقه وجود دارد.','فصل ۱۵'],
['گونهٔ غیربومی','گونه‌ای که بیرون از پراکنش طبیعی خود وارد منطقه‌ای شده است.','فصل ۱۵'],
['گونهٔ مهاجم','گونهٔ غیربومی که گسترش آن پیامد زیان‌بار بوم‌شناختی یا اقتصادی دارد.','فصل ۱۵'],
['آلودگی','ورود ماده یا انرژی به محیط به میزانی که به جانداران یا کارکرد بوم‌سازگان آسیب بزند.','فصل ۱۵']
];
const additions=[
'<h3>فراتر از کتاب: سه قلمرو حیات</h3><p>شواهد مولکولی نشان می‌دهد پروکاریوت‌ها یک گروه یکنواخت نیستند. سه قلمرو اصلی عبارت‌اند از باکتری‌ها، آرکی‌ها و یوکاریوت‌ها. آرکی‌ها هسته ندارند، اما از نظر برخی مولکول‌های غشایی و دستگاه ژنتیکی با باکتری‌ها تفاوت دارند.</p><h3>مقایسهٔ باکتری، ویروس و قارچ</h3><table class="study-table"><tr><th>ویژگی</th><th>باکتری</th><th>ویروس</th><th>قارچ</th></tr><tr><td>ساختار</td><td>پروکاریوت</td><td>غیرسلولی</td><td>یوکاریوت</td></tr><tr><td>تکثیر</td><td>تقسیم یاخته‌ای</td><td>وابسته به میزبان</td><td>جنسی یا غیرجنسی</td></tr><tr><td>ریبوزوم</td><td>دارد</td><td>ندارد</td><td>دارد</td></tr></table><h3>درخت تبارزایی</h3><p>شاخه‌هایی که نیای مشترک جدیدتری دارند خویشاوندی نزدیک‌تری را نشان می‌دهند. طول شاخه فقط در صورت داشتن مقیاس، معنی زمانی یا ژنتیکی دارد.</p>',
'<h3>فراتر از کتاب: مسیر آب در گیاه</h3><p>آب از تارهای کشنده وارد ریشه می‌شود، به آوند چوبی می‌رسد و با کمک کشش ناشی از تعرق به سوی برگ حرکت می‌کند. پیوستگی مولکول‌های آب و چسبندگی آن‌ها به دیوارهٔ آوند در این روند مؤثرند.</p><h3>فتوسنتز؛ ماده در برابر انرژی</h3><p>اتم‌های کربن مادهٔ آلی از کربن‌دی‌اکسید می‌آیند و انرژی نور برای ساخت ترکیبات آلی به کار می‌رود. اکسیژن آزادشده در فتوسنتز اکسیژن‌زا عمدتاً از آب منشأ می‌گیرد.</p><table class="study-table"><tr><th>گروه</th><th>آوند</th><th>دانه</th><th>گل و میوه</th></tr><tr><td>خزه</td><td>ندارد</td><td>ندارد</td><td>ندارد</td></tr><tr><td>سرخس</td><td>دارد</td><td>ندارد</td><td>ندارد</td></tr><tr><td>بازدانگان</td><td>دارد</td><td>دارد</td><td>ندارد</td></tr><tr><td>نهاندانگان</td><td>دارد</td><td>دارد</td><td>دارد</td></tr></table><p><b>دام مفهومی:</b> گرده‌افشانی انتقال گرده به کلاله است؛ لقاح مرحله‌ای جداگانه است.</p>',
'<h3>فراتر از کتاب: تنوع بی‌مهرگان</h3><table class="study-table"><tr><th>گروه</th><th>ویژگی شاخص</th><th>نمونه</th></tr><tr><td>اسفنج‌ها</td><td>پالایش آب از منافذ</td><td>اسفنج دریایی</td></tr><tr><td>کیسه‌تنان</td><td>سلول گزنده</td><td>عروس دریایی</td></tr><tr><td>کرم‌های پهن</td><td>بدن پهن و نرم</td><td>پلاناریا</td></tr><tr><td>کرم‌های حلقوی</td><td>بدن بندبند</td><td>کرم خاکی</td></tr><tr><td>نرم‌تنان</td><td>بدن نرم</td><td>حلزون، هشت‌پا</td></tr><tr><td>بندپایان</td><td>اسکلت خارجی و زوائد مفصلی</td><td>حشرات</td></tr><tr><td>خارپوستان</td><td>دریازی و دستگاه آب‌آوندی</td><td>ستارهٔ دریایی</td></tr></table><h3>پوست‌اندازی</h3><p>اسکلت خارجی بندپایان مانع رشد پیوستهٔ بدن می‌شود؛ جانور پوشش قدیمی را کنار می‌گذارد و پس از رشد پوشش تازه، آن را سخت می‌کند. در این فاصله آسیب‌پذیرتر است.</p>',
'<h3>فراتر از کتاب: مقایسهٔ مهره‌داران</h3><table class="study-table"><tr><th>گروه</th><th>تنفس معمول</th><th>پوشش</th><th>تنظیم دما</th></tr><tr><td>ماهی</td><td>آبشش</td><td>فلس در بسیاری</td><td>بیشتر وابسته به محیط</td></tr><tr><td>دوزیست</td><td>پوست و شش در بسیاری بالغ‌ها</td><td>پوست مرطوب</td><td>وابسته به محیط</td></tr><tr><td>خزنده</td><td>شش</td><td>پولک</td><td>وابسته به محیط</td></tr><tr><td>پرنده</td><td>شش و کیسه‌های هوادار</td><td>پر</td><td>درون‌گرم</td></tr><tr><td>پستاندار</td><td>شش</td><td>مو یا کرک</td><td>درون‌گرم</td></tr></table><h3>درون‌گرمی و برون‌گرمی</h3><p>درون‌گرمی یعنی تولید گرمای متابولیکی و تنظیم نسبتاً پایدار دما؛ پرندگان و پستانداران نمونه‌اند. در برون‌گرمی، دمای بدن بیشتر از محیط اثر می‌پذیرد. این تفاوت به معنی فعال یا غیرفعال بودن جانور نیست.</p><p><b>نکته:</b> نهنگ پستاندار است؛ با شش تنفس می‌کند و به نوزاد شیر می‌دهد.</p>',
'<h3>فراتر از کتاب: چرخهٔ کربن و نیتروژن</h3><p>فتوسنتز کربن‌دی‌اکسید را وارد مادهٔ آلی می‌کند؛ تنفس و تجزیه کربن را به محیط بازمی‌گردانند. باکتری‌های ویژه در تبدیل شکل‌های شیمیایی نیتروژن نقش دارند.</p><h3>انرژی در برابر ماده</h3><p>انرژی از تولیدکنندگان وارد شبکهٔ غذایی می‌شود و در انتقال میان سطوح بخشی از آن به صورت گرما پراکنده می‌شود. مواد و اتم‌ها در چرخه‌ها بازمی‌گردند.</p><table class="study-table"><tr><th>رابطه</th><th>اثر اول</th><th>اثر دوم</th><th>نمونه</th></tr><tr><td>همیاری</td><td>مثبت</td><td>مثبت</td><td>گل و گرده‌افشان</td></tr><tr><td>همسفرگی</td><td>مثبت</td><td>خنثی</td><td>برخی همراهان میزبان</td></tr><tr><td>انگل‌گرایی</td><td>مثبت</td><td>منفی</td><td>انگل و میزبان</td></tr><tr><td>رقابت</td><td>منفی</td><td>منفی</td><td>دو گیاه برای نور</td></tr></table><h3>جمعیت و ظرفیت برد</h3><p>اندازهٔ جمعیت به زادآوری، مرگ‌ومیر، ورود و خروج افراد بستگی دارد. ظرفیت برد اندازهٔ جمعیتی است که محیط در شرایط مشخص می‌تواند پشتیبانی کند و با تغییر محیط ثابت نمی‌ماند.</p>'
];
const motions=[
'<div class="bx-motion"><small>VISUAL MODEL · TREE OF LIFE</small><svg viewBox="0 0 500 120"><path d="M250 110V70M250 70L120 25M250 70L380 25M120 25L60 5M120 25L180 5M380 25L320 5M380 25L440 5" fill="none" stroke="#d6e56e" stroke-width="4" stroke-linecap="round" stroke-dasharray="400" class="bx-draw"/><g fill="#ed7057"><circle cx="60" cy="5" r="7"/><circle cx="180" cy="5" r="7"/><circle cx="320" cy="5" r="7"/><circle cx="440" cy="5" r="7"/></g></svg><p>شاخه‌ها گروه‌های خویشاوند و نیای مشترک را نمایش می‌دهند.</p></div>',
'<div class="bx-motion"><small>VISUAL MODEL · WATER TRANSPORT</small><div class="bx-plant"><b>ریشه</b><i>↑</i><strong>ساقه</strong><i>↑</i><em>برگ · بخار آب</em></div><p>نمایش مفهومی حرکت آب از ریشه به برگ و خروج بخار از روزنه‌ها.</p></div>',
'<div class="bx-motion"><small>VISUAL MODEL · BODY SEGMENTS</small><div class="bx-segments">'+Array.from({length:10},()=>'<i></i>').join('')+'</div><p>بندبندی بدن در برخی گروه‌های بی‌مهره دیده می‌شود.</p></div>',
'<div class="bx-motion"><small>VISUAL MODEL · VERTEBRAL COLUMN</small><div class="bx-spine">'+Array.from({length:12},()=>'<i></i>').join('')+'</div><p>مهره‌های پی‌درپی از نخاع محافظت می‌کنند.</p></div>',
'<div class="bx-motion"><small>VISUAL MODEL · FOOD WEB</small><div class="bx-food"><b>گیاه</b><i>⟶</i><b>گیاه‌خوار</b><i>⟶</i><b>شکارچی</b><i>↘</i><b>تجزیه‌کننده</b></div><p>پیکان‌ها مسیر انتقال ماده و انرژی از راه تغذیه را نشان می‌دهند.</p></div>'
];
const experiments={
osmosis:{name:'اسمز و غشای انتخاب‌پذیر',desc:'غلظت مواد حل‌شده در دو سوی غشا را تغییر بده؛ جهت حرکت خالص آب را مشاهده کن.',fields:[['a','غلظت سمت چپ',0,100,30],['b','غلظت سمت راست',0,100,70]],calc:v=>{let d=v.b-v.a;return [Math.abs(d)<3?'تعادل تقریبی؛ حرکت خالص آب نزدیک صفر است.':d>0?'آب به سمت راست حرکت خالص دارد.':'آب به سمت چپ حرکت خالص دارد.','اختلاف غلظت '+fa(Math.abs(d))+' واحد درصد است. آب از محلول رقیق‌تر به سوی محلول غلیظ‌تر حرکت خالص دارد.',Math.abs(d)]}},
photosynthesis:{name:'فتوسنتز و عوامل محدودکننده',desc:'نور، دسترسی به CO₂ و دما را تغییر بده. شاخص خروجی نسبی و آموزشی است.',fields:[['light','شدت نور',0,100,65],['co2','دسترسی CO₂',0,100,55],['temp','دما',0,45,25]],calc:v=>{let r=Math.round(Math.min(v.light/100,v.co2/100,Math.max(0,1-Math.abs(v.temp-28)/32))*100);return [r>75?'شرایط مدل برای فتوسنتز مناسب‌تر است.':r>35?'یکی از عوامل فتوسنتز را محدود می‌کند.':'فتوسنتز در این شرایط مدل‌شده پایین است.','شاخص نسبی '+fa(r)+' از ۱۰۰؛ کمترین عامل نسبی در این مدل عامل محدودکننده است. دمای بهینه به گونه بستگی دارد.',r]}},
transpiration:{name:'تعرق و تبادل گاز',desc:'رطوبت، جریان هوا و نور را تغییر بده؛ روند کیفی تعرق را بررسی کن.',fields:[['humidity','رطوبت هوا',0,100,40],['wind','جریان هوا',0,100,50],['light','شدت نور',0,100,65]],calc:v=>{let r=Math.round((100-v.humidity)*.45+v.wind*.3+v.light*.25);return [r>70?'پتانسیل تعرق بالاتر است.':r>35?'پتانسیل تعرق متوسط است.':'پتانسیل تعرق پایین‌تر است.','شاخص کیفی تعرق '+fa(r)+' از ۱۰۰. رطوبت بیشتر معمولاً اختلاف فشار بخار آب را کم می‌کند و باد می‌تواند لایهٔ مرزی اطراف برگ را نازک کند.',r]}},
enzyme:{name:'فعالیت آنزیم و دما',desc:'دما و pH را تغییر بده و اثر فاصله از شرایط بهینهٔ فرضی را ببین.',fields:[['temp','دما',0,80,37],['ph','pH',0,14,7]],calc:v=>{let r=Math.round(Math.min(Math.max(0,1-Math.abs(v.temp-37)/42),Math.max(0,1-Math.abs(v.ph-7)/7))*100);return [r>80?'آنزیم نزدیک شرایط بهینهٔ فرضی است.':r>40?'فعالیت نسبی کاهش یافته است.':'فعالیت نسبی در این شرایط پایین است.','فعالیت نسبی مدل '+fa(r)+' از ۱۰۰. دمای زیاد و pH نامناسب می‌توانند ساختار یا جایگاه فعال آنزیم را تغییر دهند.',r]}},
ecosystem:{name:'شبکهٔ غذایی و جمعیت',desc:'منابع غذایی، فشار شکار و آلودگی را تغییر بده؛ پیامد کیفی را تحلیل کن.',fields:[['food','دسترسی به غذا',0,100,70],['predator','فشار شکار',0,100,35],['pollution','آلودگی',0,100,15]],calc:v=>{let r=Math.round(Math.max(0,Math.min(100,v.food*.65+(100-v.predator)*.2+(100-v.pollution)*.15)));return [r>75?'شرایط کلی مدل برای جمعیت مناسب‌تر است.':r>45?'جمعیت با چند فشار محیطی روبه‌رو است.':'فشارهای محیطی در این سناریو زیادند.','شاخص پایداری آموزشی '+fa(r)+' از ۱۰۰. در طبیعت شبکه‌ها پیچیده‌اند و تغییر یک عامل می‌تواند پیامدهای غیرخطی داشته باشد.',r]}}
};
let active='osmosis';
function renderExperiment(){
 const host=$('#labExperiment'),e=experiments[active];if(!host)return;
 host.innerHTML='<div class="bx-lab-card"><h3>'+e.name+'</h3><p>'+e.desc+'</p><div class="bx-controls">'+e.fields.map(f=>'<label>'+f[1]+' <b id="v-'+f[0]+'">'+fa(f[4])+'</b><input id="r-'+f[0]+'" type="range" min="'+f[2]+'" max="'+f[3]+'" value="'+f[4]+'"></label>').join('')+'</div><div class="bx-lab-scene"><div class="bx-left"></div><div class="bx-membrane"></div><div class="bx-right"></div><div class="bx-particles">'+Array.from({length:22},(_,i)=>'<i style="--n:'+i+'"></i>').join('')+'</div></div><div class="bx-result" id="bx-result"></div><div class="bx-meter"><span>شاخص نسبی</span><div><i id="bx-meter-fill"></i></div><b id="bx-meter-value"></b></div><small>مدل آموزشی مفهومی است؛ خروجی آن اندازه‌گیری واقعی یا پیش‌بینی کمی طبیعت نیست.</small></div>';
 const update=()=>{let v={};e.fields.forEach(f=>{v[f[0]]=+$('#r-'+f[0]).value;$('#v-'+f[0]).textContent=fa(v[f[0]])});let r=e.calc(v);$('#bx-result').innerHTML='<b>'+r[0]+'</b><p>'+r[1]+'</p>';$('#bx-meter-fill').style.width=Math.max(0,Math.min(100,r[2]))+'%';$('#bx-meter-value').textContent=fa(r[2])+'٪';};
 e.fields.forEach(f=>$('#r-'+f[0]).addEventListener('input',update));update();
}
function renderLab(){
 let host=$('#labView');if(!host)return;
 host.innerHTML='<button class="back" onclick="goHome()">← بازگشت به پایگاه</button><div class="eyebrow">VIRTUAL LAB / INTERACTIVE MODELS</div><h2>آزمایشگاه مجازی زیست‌شناسی</h2><p>متغیرها را تغییر بده، نتیجه را مشاهده کن و توضیح علمی آن را بخوان. شبیه‌سازی‌ها مدل مفهومی‌اند، نه دادهٔ آزمایشگاهی واقعی.</p><div class="bx-lab-tabs">'+Object.keys(experiments).map(k=>'<button data-exp="'+k+'" class="'+(k===active?'active':'')+'">'+experiments[k].name+'</button>').join('')+'</div><div id="labExperiment"></div>';
 host.querySelectorAll('[data-exp]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.exp;renderLab()}));renderExperiment();
}
function renderGlossary(){
 let host=$('#glossaryView');if(!host)return;
 host.innerHTML='<button class="back" onclick="goHome()">← بازگشت به پایگاه</button><div class="eyebrow">BIOLOGY LEXICON / GRADE 09</div><h2>واژه‌نامهٔ جامع زیست‌شناسی</h2><p>اصطلاحات پنج فصل با تعریف علمی و دسته‌بندی فصل. موارد تکمیلی با برچسب «فراتر از کتاب» مشخص شده‌اند.</p><div class="bx-gloss-tools"><input class="glossInput" id="bx-search" placeholder="جست‌وجوی واژه یا تعریف…"><select id="bx-category"><option>همه</option><option>فصل ۱۱</option><option>فصل ۱۲</option><option>فصل ۱۳</option><option>فصل ۱۴</option><option>فصل ۱۵</option><option>عمومی</option><option>فراتر از کتاب</option></select><b id="bx-count"></b></div><div id="bx-glossary" class="bx-glossary"></div>';
 $('#bx-search').addEventListener('input',filterGloss);$('#bx-category').addEventListener('change',filterGloss);filterGloss();
}
function filterGloss(){
 let q=norm($('#bx-search')?.value||''),cat=$('#bx-category')?.value||'همه';
 let rows=terms.filter(t=>(cat==='همه'||t[2]===cat)&&(!q||norm(t.join(' ')).includes(q))).sort((a,b)=>a[0].localeCompare(b[0],'fa'));
 $('#bx-count').textContent=fa(rows.length)+' اصطلاح';
 $('#bx-glossary').innerHTML=rows.map(t=>'<article><header><b>'+t[0]+'</b><span>'+t[2]+'</span></header><p>'+t[1]+'</p></article>').join('')||'<p>واژه‌ای پیدا نشد.</p>';
}
function appendChapter(i){
 let body=$('#lessonContent .lessonBody');if(!body||body.querySelector('.bx-extra'))return;
 let box=document.createElement('section');box.className='bx-extra';box.innerHTML='<div class="bx-label">ADVANCED FIELD NOTES · فراتر از کتاب</div>'+additions[i]+'<div class="bx-motion-wrap">'+motions[i]+'</div>';body.appendChild(box);
}
function install(){
 let old=window.openLesson;if(typeof old==='function'&&!old.__bx2){let fn=function(i){old(i);appendChapter(i)};fn.__bx2=true;window.openLesson=fn;}
 let oldLab=window.openLab;window.openLab=function(){if(typeof oldLab==='function')oldLab();renderLab()};
 let oldGloss=window.showGlossary;window.showGlossary=function(){if(typeof oldGloss==='function')oldGloss();renderGlossary()};
 let st=document.createElement('style');st.textContent=
'.bx-extra{border-top:2px solid #d9e2d8;margin-top:34px;padding-top:8px}.bx-label{margin:28px 0 12px;background:#f5e8df;border-right:4px solid #ed7057;padding:10px 13px;color:#a94d3c;font-size:11px;font-weight:900;letter-spacing:1px}.bx-motion{background:#203b43;color:#f8f6ec;border-radius:18px;padding:17px;margin:24px 0;overflow:hidden}.bx-motion small{color:#d6e56e;letter-spacing:1.5px;font-weight:900}.bx-motion p{color:#d1ded8;font-size:11px}.bx-motion svg{width:100%;height:120px}.bx-draw{stroke-dasharray:400;stroke-dashoffset:400;animation:bxDraw 3s ease forwards}@keyframes bxDraw{to{stroke-dashoffset:0}}.bx-plant{height:115px;display:flex;align-items:center;justify-content:center;gap:15px;color:#d6e56e}.bx-plant strong{background:#579b73;padding:30px 9px;border-radius:15px}.bx-plant i{animation:bxUp 1.2s ease-in-out infinite alternate;font-size:25px}.bx-plant em{background:#a5c98a;color:#203b43;padding:12px;border-radius:20px}@keyframes bxUp{to{transform:translateY(-12px)}}.bx-segments,.bx-spine{display:flex;justify-content:center;gap:5px;padding:25px}.bx-segments i{width:30px;height:40px;border:3px solid #d6e56e;border-radius:40%;background:#699a85;animation:bxPulse 1.5s ease-in-out infinite alternate}.bx-segments i:nth-child(odd){animation-delay:-.7s}@keyframes bxPulse{to{transform:translateY(-7px)}}.bx-spine i{width:20px;height:37px;border-radius:8px;background:#e5d6ad;animation:bxWave 2s ease-in-out infinite alternate}.bx-spine i:nth-child(odd){animation-delay:-.8s}@keyframes bxWave{to{transform:translateY(-7px) rotate(5deg)}}.bx-food{display:flex;align-items:center;justify-content:space-around;gap:5px;flex-wrap:wrap;padding:28px 0}.bx-food b{background:#d6e56e;color:#203b43;border-radius:8px;padding:9px;font-size:10px}.bx-food i{color:#ed9b78;animation:bxBlink 1s infinite alternate}@keyframes bxBlink{to{opacity:.2}}.bx-gloss-tools{display:grid;grid-template-columns:minmax(0,1fr) 180px auto;gap:9px;margin:18px 0}.bx-gloss-tools select{border:1px solid var(--line);border-radius:12px;padding:10px;background:white;color:var(--ink);font:inherit;font-size:12px}.bx-gloss-tools b{align-self:center;color:var(--blue);font-size:11px;white-space:nowrap}.bx-glossary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.bx-glossary article{background:#fffdf8;border:1px solid var(--line);border-radius:13px;padding:13px}.bx-glossary header{display:flex;justify-content:space-between;align-items:center;gap:8px}.bx-glossary header b{color:#284a50;font-size:14px}.bx-glossary header span{font-size:9px;color:var(--blue);background:#e9edff;padding:3px 7px;border-radius:15px;white-space:nowrap}.bx-glossary p{font-size:11px;line-height:2;color:#53636a;margin:8px 0 0}.bx-lab-tabs{display:flex;gap:7px;overflow:auto;padding:14px 0}.bx-lab-tabs button{white-space:nowrap;border:1px solid var(--line);background:#fffdf8;color:var(--ink);border-radius:10px;padding:9px 12px;font-size:11px}.bx-lab-tabs button.active{background:#263f48;color:white}.bx-lab-card{background:#f7f5ed;border:1px solid var(--line);border-radius:18px;padding:17px}.bx-lab-card h3{margin:3px 0}.bx-lab-card p{font-size:12px;color:#617078}.bx-controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:18px 0}.bx-controls label{background:white;border:1px solid var(--line);border-radius:11px;padding:11px;font-size:11px}.bx-controls b{float:left;color:var(--blue)}.bx-controls input{display:block;width:100%;margin-top:10px;accent-color:var(--blue)}.bx-lab-scene{height:160px;border-radius:14px;position:relative;overflow:hidden;background:linear-gradient(90deg,#9fcfc0,#e7c18f)}.bx-left,.bx-right{position:absolute;top:0;bottom:0;width:50%;opacity:.45}.bx-left{left:0;background:#5caa94}.bx-right{right:0;background:#dc8c6f}.bx-membrane{position:absolute;left:50%;top:0;bottom:0;width:7px;transform:translateX(-50%);background:repeating-linear-gradient(0deg,#fff 0 7px,#3157d5 7px 10px)}.bx-particles{position:absolute;inset:0}.bx-particles i{position:absolute;width:7px;height:7px;border-radius:50%;background:white;left:calc(var(--n,1)*3%);top:calc(var(--n,1)*4%);animation:bxFloat 2s infinite alternate}@keyframes bxFloat{to{transform:translate(13px,-8px);opacity:.3}}.bx-result{margin-top:13px;padding:13px;background:#e8eddf;border-right:4px solid #ed7057;border-radius:9px}.bx-result p{margin:5px 0 0;line-height:2}.bx-meter{display:flex;align-items:center;gap:10px;font-size:10px;margin:14px 0}.bx-meter div{height:8px;background:#e1dfd5;border-radius:20px;overflow:hidden;flex:1}.bx-meter i{display:block;height:100%;background:#3157d5;transition:width .2s}.bx-lab-card>small{font-size:10px;color:#7b8581}@media(max-width:600px){.bx-gloss-tools{grid-template-columns:1fr 1fr}.bx-gloss-tools input{grid-column:1/-1}.bx-glossary{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.bx-motion *{animation:none!important;transition:none!important}}';
 document.head.appendChild(st);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
window.BIOLOGY_X_UPGRADE={glossaryTerms:terms.length,labs:Object.keys(experiments),version:'2.0'};
})();