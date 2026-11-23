---
description: "EduBeam 2D बीम, फ्रेम और ट्रस के लिए ब्राउज़र में चलने वाला निःशुल्क FEM सॉल्वर है: यह क्या कर सकता है और क्या नहीं, किसके लिए है और मार्गदर्शिका कैसे बनी है।"
source: site
---

# परिचय

[EduBeam]{.edubeam} **बीम, फ्रेम और ट्रस** के संरचनात्मक विश्लेषण के लिए एक निःशुल्क ऐप है, जो आपके ब्राउज़र में चलता है। आप संरचना बनाते हैं, उसे सपोर्ट देते हैं और भार लगाते हैं: आपके हर बदलाव के साथ परिमित अवयव (finite element) सॉल्वर आरेख, प्रतिक्रियाएँ और विक्षेप फिर से परिकलित कर देता है। न हल करने का कोई अलग बटन है, न कुछ इंस्टॉल करना है, न कोई खाता बनाना है।

::div{.actions}
[EduBeam खोलें ↗](https://run.edubeam.app/?lang=hi){target="_blank"} [त्वरित शुरुआत, 10 मिनट](/hi/guide/quick-start)
::

![EduBeam में एक त्रि-हिंज फ्रेम: भार नारंगी में, प्रतिक्रियाएँ बैंगनी में, बंकन आघूर्ण लाल में और विरूपित आकार धूसर में।](/screenshots/hi/hero.webp)

:span{#your-first-visit}

## यह क्या करता है {#what-it-does}

::card-grid{cols="2"}
:::card{title="संरचनाएँ" icon="lucide:triangle" to="/hi/essentials/elements"}
x–z समतल में बीम, सतत बीम, फ्रेम और ट्रस, जो Timoshenko बीम अवयवों से बने होते हैं। सिरे के हिंज किसी सदस्य को ट्रस छड़ (truss bar) में बदल देते हैं।
:::
:::card{title="सपोर्ट" icon="lucide:anchor" to="/hi/essentials/nodes-supports#supports"}
पिन, रोलर, फिक्स्ड, स्लाइडर, या अवरुद्ध `Dx`, `Dz` और `Ry` का कोई भी संयोजन, प्रतीक से चुना हुआ। झुके सपोर्ट और सपोर्ट का धँसाव (support settlement)।
:::
:::card{title="भार" icon="lucide:arrow-down-to-line" to="/hi/essentials/loads"}
नोडों पर या अवयव पर कहीं भी बल और आघूर्ण, समान और समलम्बी रेखीय भार, तापमान, और निर्धारित विस्थापन।
:::
:::card{title="अनुप्रस्थ काट" icon="lucide:shapes" to="/hi/essentials/elements#cross-sections"}
यूरोपीय और अमेरिकी लाइब्रेरी, या आपका बनाया कोई भी बहुभुज; $A$, $I_y$, $I_z$, $I_{yz}$, मुख्य अक्ष और परिभ्रमण त्रिज्या परिकलित होकर मिलते हैं।
:::
:::card{title="परिणाम" icon="lucide:chart-spline" to="/hi/essentials/results"}
**N**, **V** और **M** आरेख, विरूपित आकार, प्रतिक्रियाएँ, नोडल विस्थापन, सिरा-बल और अवयवों के कठोरता मैट्रिक्स।
:::
:::card{title="विश्लेषण" icon="lucide:calculator" to="/hi/elements/analysis"}
रैखिक स्थैतिक विश्लेषण, जो रैखिक मॉडल के लिए सटीक है: मेश को महीन करने की कोई ज़रूरत नहीं। जो संरचना खड़ी नहीं रह सकती, उसका कारण EduBeam बताता है और उसकी गति एनिमेशन में दिखाता है।
:::
:::card{title="फ़ाइलें" icon="lucide:folder-open" to="/hi/essentials/import-export"}
प्रोजेक्ट JSON के रूप में, पूरा मॉडल लिंक के रूप में, चित्र PNG या SVG में, परिणाम CSV में। जिस मॉडल की जगह नया मॉडल खुलता है, वह भी सहेजा रहता है, और कुछ भी आपके डिवाइस से बाहर नहीं जाता।
:::
:::card{title="इकाइयाँ" icon="lucide:ruler" to="/hi/essentials/units-settings"}
एक क्लिक में SI या US customary, या हर इकाई अलग से। z अक्ष नीचे की ओर, या पाठ्यपुस्तक की तरह y ऊपर की ओर।
:::
::

## यह क्या नहीं करता (अभी) {#what-it-does-not-do-yet}

सीमाएँ पहले से जान लेने से समय बचता है:

::div{.limits}
- **केवल 2D।** समतल से बाहर का व्यवहार नहीं, 3D फ्रेम नहीं।
- **केवल रैखिक स्थैतिक।** द्वितीय-कोटि (P–Δ) प्रभाव, बकलिंग (buckling), गतिकी (dynamics) या प्लास्टिसिटी नहीं।
- **एक लोड केस।** भार संयोजन या एनवेलप नहीं: हर केस को अपनी अलग फ़ाइल या लिंक के रूप में सहेजें।
- **स्व-भार नहीं।** उसे रेखीय भार के रूप में लगाएँ।
- **डिज़ाइन जाँच नहीं।** EduBeam आंतरिक बल और विस्थापन देता है; डिज़ाइन कोड के अनुसार जाँच आपको स्वयं करनी है।
::

अगर आपको कोई ऐसी सुविधा चाहिए जो अभी नहीं है, तो [GitHub पर issue खोलें](https://github.com/janvorisek/edubeam/issues)।

::elementarium-promo{placement="introduction"}
::

## यह किसके लिए है? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="विद्यार्थी" icon="lucide:graduation-cap" to="/hi/practice"}
हाथ से की गई गणना की तुरंत जाँच, और अभ्यास प्रश्न जो आपके उत्तर साथ-साथ जाँचते हैं।
:::
:::card{title="शिक्षक" icon="lucide:presentation" to="/hi/guide/teaching"}
प्रोजेक्टर पर लाइव दिखाएँ कि सपोर्ट, हिंज और भार बलों को कैसे बदलते हैं, 22 भाषाओं में; और हर विद्यार्थी के लिए अलग प्रश्नपत्र छापें।
:::
:::card{title="इंजीनियर" icon="lucide:hard-hat" to="/hi/elements/analysis"}
किसी भारी डेस्कटॉप पैकेज को खोलने से पहले एक त्वरित जाँच; हल का हर चरण इस साइट पर समझाया गया है।
:::
:::card{title="डेवलपर" icon="lucide:code-xml" to="#libraries"}
EduBeam का सॉल्वर और उसकी ड्रॉइंग लाइब्रेरी, आपके अपने कोड के लिए ओपन-सोर्स रूप में।
:::
::

## मार्गदर्शिका में क्या कहाँ है {#how-this-guide-is-organised}

साइडबार में पृष्ठ नीचे दिए समूहों में बँटे हैं। ऐप में **?** बटन इसी मार्गदर्शिका का संबंधित पृष्ठ आपकी भाषा में खोलते हैं।

::card-grid{cols="2"}
:::card{title="यहाँ से शुरू करें" icon="lucide:flag" to="/hi/guide/quick-start"}
यह पृष्ठ, और त्वरित शुरुआत: दस मिनट में पहला बीम।
:::
:::card{title="मॉडल बनाएँ" icon="lucide:pencil-ruler" to="/hi/essentials/user-interface"}
इंटरफ़ेस, नोड और सपोर्ट, अवयव, सामग्री और अनुप्रस्थ काट, भार, इकाइयाँ और सेटिंग्स।
:::
:::card{title="परिणाम पढ़ें" icon="lucide:chart-spline" to="/hi/essentials/results"}
आरेख और परिणाम तालिकाएँ, और उन्हें हाथ से कैसे जाँचें।
:::
:::card{title="साझा करें और पढ़ाएँ" icon="lucide:share-2" to="/hi/essentials/import-export"}
प्रोजेक्ट फ़ाइलें, साझा लिंक, चित्र और CSV निर्यात, और EduBeam के साथ पढ़ाना।
:::
:::card{title="ट्यूटोरियल" icon="lucide:triangle" to="/hi/tutorials/inclined-beam"}
एक झुका बीम, एक त्रि-हिंज फ्रेम, एक समतल ट्रस और धँसते सपोर्ट वाला एक सतत बीम, हर एक कदम-दर-कदम बनाया और हाथ से जाँचा हुआ।
:::
:::card{title="उदाहरण" icon="lucide:library" to="/hi/examples/"}
छह तैयार मॉडल जो एक क्लिक में खुलते हैं, अभ्यास और उत्तरों के साथ।
:::
:::card{title="सैद्धांतिक मैनुअल" icon="lucide:sigma" to="/hi/elements/conventions"}
अक्ष और चिह्न परिपाटी, बीम और ट्रस अवयव, और EduBeam मॉडल को कैसे हल करता है।
:::
:::card{title="सहायता" icon="lucide:life-buoy" to="/hi/reference/shortcuts"}
कीबोर्ड, माउस और टच, समस्या निवारण, और अक्सर पूछे जाने वाले प्रश्न।
:::
::

## अपने टूल खुद बनाएँ {#libraries}

EduBeam दो ओपन-सोर्स लाइब्रेरी पर बना है, जिनकी पूरी जानकारी इसी साइट पर है। इनसे आप किसी स्क्रिप्ट में संरचनाएँ हल कर सकते हैं, हर विद्यार्थी के लिए अलग अभ्यास बना सकते हैं, या स्लाइडों और नोट्स के लिए चित्र तैयार कर सकते हैं।

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/hi/solver"}
EduBeam के पीछे का परिमित अवयव सॉल्वर, TypeScript में: ब्राउज़र में या Node में, एक दर्जन पंक्तियों में बीम का मॉडल बनाएँ, उसे हल करें और परिणाम पढ़ें।
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/hi/plot"}
Vue 3 कंपोनेंट जो हल की गई संरचना को उसके भारों, प्रतिक्रियाओं और N, V, M आरेखों के साथ SVG के रूप में बनाते हैं।
:::
::

## भाषाएँ {#languages}

EduBeam 22 भाषाओं में उपलब्ध है और आपके ब्राउज़र की भाषा में शुरू होता है। भाषा **सेटिंग्स → भाषा और लोकेल** में बदलें, या यहाँ से चुनें:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

भाषा लिंक से भी तय की जा सकती है: `run.edubeam.app/?lang=hi` ऐप को हिन्दी में खोलता है।

## लेखक और श्रेय {#authors-credits}

[EduBeam]{.edubeam} को [Jan Voříšek](https://github.com/janvorisek) एक स्वतंत्र प्रोजेक्ट के रूप में विकसित करते हैं। यह Windows और Linux के लिए बने मूल डेस्कटॉप EduBeam की परंपरा को आगे बढ़ाता है, जिसे [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) और [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) ने प्राग के चेक तकनीकी विश्वविद्यालय (CTU) के [सिविल इंजीनियरिंग संकाय](https://www.fsv.cvut.cz/en) के यांत्रिकी विभाग में बनाया था, और आज भी उसकी सहेजी हुई सत्र फ़ाइलें खोल लेता है। इसका सॉल्वर, [@edubeam/fem](/hi/solver), Bořek Patzák के पहले संस्करण से विकसित हुआ है। ऐप और सॉल्वर दोनों ओपन-सोर्स हैं, GPL-3.0 लाइसेंस के अंतर्गत।

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"मुख्य डेवलपर और प्रोडक्ट डिज़ाइनर","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"डेवलपर: टच नियंत्रण, ड्रॉइंग की गति, भार और सपोर्ट","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"मूल EduBeam और पहला FEM सॉल्वर","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## योगदान करें {#contribute}

::card-grid{cols="3"}
:::card{title="समस्या बताएँ" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
कुछ उलझाने वाला, गलत या टूटा हुआ लगा? GitHub पर एक issue सीधे टीम तक पहुँचता है।
:::
:::card{title="अनुवाद सुधारें" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
ऐप के सभी टेक्स्ट हर भाषा के लिए एक अलग फ़ाइल में हैं; pull request का स्वागत है।
:::
:::card{title="आगे बढ़ाएँ" icon="lucide:share-2"}
EduBeam के बारे में सहपाठियों और सहकर्मियों को बताएँ, या अपने नोट्स में किसी मॉडल का लिंक रखें।
:::
::
