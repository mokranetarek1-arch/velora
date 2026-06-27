import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { FaArrowLeft, FaBoxOpen, FaCheckCircle, FaShieldAlt, FaTruck, FaShoppingCart, FaChevronLeft, FaChevronRight, FaSearchPlus, FaTimes } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductDetail.css";

const wilayas = [
  { code: "01-Adrar", communes: ["Adrar", "Aoulef", "Akabli", "Imantas", "Araouane", "Ine Ouini", "Tamantit", "Ouled Ahmed Timia", "Zaouiet Kounta"] },
  { code: "02-Chlef", communes: ["Chlef", "Ténès", "Sendja", "Hadjadj", "Tatouine", "Bni Haoua", "Sobh", "Mechraa Sfa", "Talassa", "Oued Goussine", "Sidi Abdelaziz", "Benachiba", "Sebt"] },
  { code: "03-Laghouat", communes: ["Laghouat", "Ain Madhi", "Brida", "Oued Morra", "Gueltat Sidi Saïd", "Oum Lacheche", "Sidi Makhlouf", "Ksar El Hirane"] },
  { code: "04-Oum El Bouaghi", communes: ["Oum El Bouaghi", "Ain Beida", "Ksar Raoui", "N'Tchout", "Ain Kercha", "Sériana", "Aïn Yebna", "Magrane", "Fouche", "Thaledjimount"] },
  { code: "05-Batna", communes: ["Batna", "Arris", "Aumale", "N'Gaous", "Tazoult", "Barika", "Ain Yagout", "Seriana", "Ain Touta", "Timgad", "Theniet El Had", "Kimba", "Menaâ", "Akbou", "Seggana", "Menucha", "Gosbaya"] },
  { code: "06-Bejaia", communes: ["Béjaïa", "Tizi-Ouzemeur", "Sidi Aïch", "Kherrata", "Béni Ourtilane", "Amizour", "Sidi Bouazza", "Akbou", "Amalou", "Adekar", "Ouacif", "Branis", "Tamokra", "Fenaia El Guessir", "Tichy", "Boukhlifa", "Talassemtane", "Tala Bounane", "Darguina", "Tazbent", "Oued Kmène"] },
  { code: "07-Biskra", communes: ["Biskra", "Sidi Okba", "Chetma", "Tolga", "Ourlal", "Ras El Oued", "Bou Noura", "Zaouia", "Oued Dlaa", "El Feidh", "El Kantara", "Sidi Khaled", "Lilech", "Merouan", "Oulmes", "Doucen", "Jamourah", "Thimissart", "Ain Naga", "Mlili", "Hadj El Okbi"] },
  { code: "08-Bechar", communes: ["Béchar", "Taghit", "Beni Abbès", "Meridja", "Kenadsa", "Abadla", "Beni Ounif", "Erg Ferradj", "Ain Sefra", "Boukais", "Brezina", "Daoura", "El Ouata", "Tabelbala", "Timedeline"] },
  { code: "09-Blida", communes: ["Blida", "Ouled Yaïch", "Boumerdès", "Bou Ismail", "Sidimorocco", "Larba", "Bouinan", "Djinane", "Mouzaia", "Beni Mered", "Soumaa", "Bibans", "Oued El Alleug", "Sbaïa", "Sidi Ghiles", "El Affroun", "Blida"] },
  { code: "10-Bouira", communes: ["Bouira", "Aïn Bessem", "Sour El Ghozlane", "Hadjebil", "Taourirt", "Kadiria", "M'Chedallah", "Sidi Khaled", "Bir Ghbalou", "Benchouk", "El Asnam", "Bechloul", "Taglait"] },
  { code: "11-Tamanrasset", communes: ["Tamanrasset", "In-Guezzam", "Araouane", "Tin-Zaouatène", "Tassili", "Ideles", "Arak", "Abalessa", "Jinet", "Tellatéine"] },
  { code: "12-Tebessa", communes: ["Tébessa", "Thaglit", "El Ogla", "Bekkaria", "Oum Ali", "Négrine", "Sbeitla", "Ain Zerga", "Tiffech", "El Houari", "Ain Saoura", "Guefifes", "Lahouat", "El Guettar"] },
  { code: "13-Tlemcen", communes: ["Tlemcen", "Chetouane", "Sidi Djebbar", "Ouled Mimoun", "Sidi Medjahed", "Sabra", "Gharbaoua", "Ain Fezza", "Sebdou", "Talaimet", "Oued Chouly"] },
  { code: "14-Tiaret", communes: ["Tiaret", "Aïn Deheb", "Sougueur", "Mécheria", "Oued Djemâa", "Ksar Chellala", "Oued Lilli", "Sebt", "Rahouane", "Sidi Bakhti", "Sedjera", "Guertoufa", "Mahdia", "Oued Chorfa", "Medjahed", "Marmoul", "Merikhi", "Nadore", "Oued Sehoul", "Ouadhia", "Saïdi Ghrab", "Sidi Hosni", "Sidi Ali Boussidi", "Takardjebet", "Tamellaht", "Touffout", "Trézel"] },
  { code: "15-Tizi Ouzou", communes: ["Tizi Ouzou", "Draa El Mizan", "Mekla", "Boghni", "Tizi Rached", "Azazga", "Draâ Ben Khedda", "Aghbalou", "Beni Douala", "Aqbou", "Iferhounène", "Ifri", "Yatafen", "Zekri", "Oued Aissi", "Soumaâ", "Timizar", "Tizi N'Tleta", "Tighzirt", "Tigzirt", "Mizrana", "Yakourene", "Mechtras", "Ouacif", "Sedjera", "Taourirt Ouchene", "Bastos", "Beni Khalfallah"] },
  { code: "16-Alger", communes: ["Alger", "Bab El Oued", "Bélouizdad", "Casbah", "Bir Mourad Raïs", "Rais Hamidou", "Sidi M'Hamed", "Kouba", "Bouchaoui", "Aïn Benian","Bouzareah", "Dargana", "Dely Ibrahim", "Draria","Fedaïa", "Gué de Constantine", "Hydra", "Khraïcia","Mahalma", "Ouled Fayet", "Rouiba", "Saoula", "Sidi Fredj", "Souidania","Tessala El Merdja"] },
  { code: "17-Djelfa", communes: ["Djelfa", "Aïn Oussera", "Birine", "Hassi Bahbah", "Sidi Lakhdar", "Tiaret", "Ain Maabed", "El Souagui", "Hassi Fadel", "Hassi Fedoul", "Messaad", "Sebseb", "Sedraia", "Tabrart", "Taffessour", "Tagdemt", "Tilghemt", "Moudjebara", "Zaâfrane"] },
  { code: "18-Jijel", communes: ["Jijel", "Taher", "Oudjlal", "Kaous", "Sidi Meroum", "Toudja", "Settara", "Aït Smail", "Emir Abdelkader", "El Milia", "Ennelouene", "Ghebala", "Gouttaya", "Laouanech", "Mers El Kébir", "Mizrana", "Nost", "Oued El Kébir", "Rouambia", "Selma Benziada", "Sidi Abdelaziz", "Texenna", "Yabous", "Zerdezas", "Ziama Mansouriah"] },
  { code: "19-Setif", communes: ["Sétif", "Ain Abessa", "Aïn Oulmène", "Beni Ourtilane", "Oued Athmania", "Bani Khaled", "Béni Djimla", "Béni Aziz", "Béni Fouda", "Beni Haoua", "Beni Mellal", "Beni Seghouane", "Béni Soudane", "Béni Tamdjout", "Béni Yenni", "Bouaada", "Bouandas", "Bouchagouf", "Boudjemia", "Bougaa", "Bougar", "Bouhadjar", "Boumahra Ahmed", "Boumahrouk", "Boutaleb", "Boutalebine", "Boutelis", "Bouzeguene", "Collo", "Demouche", "Djamaâ", "Djemila", "Djimla", "Drean", "El Eulma", "Fedj M'zala", "Fenaia", "Feraoun", "Ferdjioua", "Fergoug", "Fernana", "Gafour", "Gamra", "Gaoua", "Gouchache", "Guellal", "Guerrara", "Guessa", "Guidjba", "Guidimé", "Guigues", "Guiza", "Guzoul", "Hammam Guergour", "Hammam N'Bails", "Hammam Soukhna", "Hannencha", "Hasnaoua", "Hassi Bahbah", "Hassi Fedoul", "Hassi Messaoud", "Hassi Ouled Ali", "Henancha", "Henaïa", "Henaya", "Hidoussa", "Higel", "Higuella", "Himmiche", "Hindjebel", "Hiraoua", "Hirouane", "Hirouenne", "Hocine Smayel", "Hodna", "Hogenine", "Houidje", "Hoularia", "Houlassene", "Hounia", "Houria", "Houriane", "Hourliguène", "Hourliguène Djebel", "Hourliguène Nord", "Hourliguène Ouest", "Hourl'guène", "Hourli", "Hourlis", "Hourmate", "Hourmine", "Hourmit", "Hournace", "Hoursaïne", "Hoursa'ine", "Hourselguene", "Hoursene", "Hourses", "Hourta", "Hourtalane", "Hourtalène", "Hourti", "Hourtis", "Hourtissie", "Hourtoula", "Hourtoune", "Hourtoun", "Hourtouta", "Hourti"] },
  { code: "20-Saida", communes: ["Saïda", "Ouled Khaled", "Sidi Bouazza", "Aïn El Hadjar", "Aïn Sénia", "Rebahia", "Sidi Ali Benyoub", "Sidi Ahmed", "Sidi Amar", "Tadjemout", "Tilmas", "Youb"] },
  { code: "21-Skikda", communes: ["Skikda", "Sidi Meroum", "El Hadaïque", "Beni Ounif", "Collo", "Ain Zouit", "Beni Djenane", "Beni Khaled", "Bougous", "Collo", "El Hadaïque", "El Marsa", "Emir Abdelkader", "Guelaa", "Karaïa", "Sidi Ferjaoui", "Skikda"] },
  { code: "22-Sidi Bel Abbes", communes: ["Sidi Bel Abbès", "Télagh", "Méridja", "Oran", "Sebdou", "Ain Tédèles", "Ben Badis", "Chabake", "Chetouane", "Doui Thlelis", "Ain Fares", "Ould Khaled", "Oued Taht", "Oulhassene", "Sebdou", "Taibaoui", "Telagh", "Telagtine", "Teleta", "Teleta Ellel", "Teleta Nord", "Teleta Ouest", "Telit", "Tellagh", "Tellag", "Tellaghzoula", "Tellaghoula", "Tellaha", "Tellahin", "Tellaïne", "Tellaïne Nord", "Tellaïne Ouest", "Tellajel", "Tellakin", "Tellakht", "Tellalouna", "Tellamaïne", "Tellamaïne Ouest", "Tellamaïne Sud", "Tellamena", "Tellamicha", "Tellandja", "Tellanemene", "Tellanout", "Tellapeïne", "Tellapène", "Tellarah", "Tellaré", "Tellarem", "Tellareneg", "Tellarha", "Tellarim", "Tellarouane", "Tellatache", "Tellatache Nord", "Tellatache Ouest", "Tellatachèche", "Tellatachèn", "Tellatachoua", "Tellatachte", "Tellatadi", "Tellatagane", "Tellatah", "Tellatahe", "Tellatahi", "Tellatahir", "Tellatahira", "Tellatahire"] },
  { code: "23-Annaba", communes: ["Annaba", "Sidi Amir", "Seraïdi", "El Bouni", "Ain Berda", "El Hadjar", "Sidi Driss", "Sidi Yacine", "Berrahal", "Chetaibi", "Cours", "Darabad", "Daralia", "Daralies", "Darania", "Darania Nord", "Darania Ouest", "Daraniane", "Darara", "Darbaoui", "Darben", "Darbenia", "Darbessa", "Darbete", "Darbiba", "Darbicha", "Darbichia", "Darbina", "Darbinane", "Darbine", "Darbit", "Darbithe", "Darbizane", "Darbizenne", "Darblina", "Darbliyene", "Darblizane", "Darblizenne", "Darblizine", "Darblizoun", "Darbouaza", "Darbouaza Nord", "Darbouaza Ouest", "Darboudi", "Darboudine", "Darboufan", "Darboufane", "Darboufene", "Darbouge", "Darbouja", "Darboujat", "Darboujatte", "Darboujaïne", "Darboujane", "Darboujea", "Darboujeet", "Darboujelle", "Darboujene", "Darboujenne", "Darboujène", "Darboujetta", "Darboujette", "Darboujée", "Darboujéine", "Darboujéna", "Darboujène", "Darboujéta", "Darboujétée", "Darboujeta", "Darboujeta Nord", "Darboujeta Ouest", "Darboujeta Sud"] },
  { code: "24-Guelma", communes: ["Guelma", "Taher", "Hamalaïa", "Kessra", "Belkheir", "Ain Benkhelil", "Bouhamdane", "Djoudi", "Oued Zénati", "Sebaine", "Taffara", "Hammamet", "Heliopolis", "Heliopolis Nord", "Heliopolis Ouest", "Heliotel", "Helioupolis", "Heliov", "Helix", "Hellada", "Helle", "Helle Nord", "Helle Ouest", "Hellebronde", "Hellecour", "Hellecour Est", "Hellecour Nord", "Hellecour Ouest", "Hellecouraise", "Hellecourta", "Helledague", "Helledal", "Helledal Nord", "Helledal Ouest", "Helledale", "Helledalet", "Helledeliene", "Helledeliène", "Helledemine", "Helledelienne"] },
  { code: "25-Constantine", communes: ["Constantine", "El Khroub", "Ibn Ziad", "Hamma Bouziane", "Ain Abid", "Ain Smara", "Benachiba", "Chaaraoui", "Didouche Mourad", "Haraoua", "Hammadia", "Harbaoua", "Haram", "Haraoua", "Haraya", "Harbaia", "Harbaïa", "Harbaia Nord", "Harbaia Ouest", "Harbaïenne", "Harbaïa", "Harbamaine", "Harbamène", "Harbamienne", "Harbaïa", "Harbaiea", "Harbaïe", "Harbaïée", "Harbaïènes", "Harbaïenne", "Harbaïèque", "Harbaïète", "Harbaïétée"] },
  { code: "26-Medea", communes: ["Médéa", "Ksar Benchohra", "Sebaïn", "Ouzera", "Souagui", "Draria", "Khams Djouadj", "Benchicao", "Tadjemout", "Tebbouda", "Hammam Righa", "Ouzera", "Sekafta", "Souagui", "Tablat", "Tadjemout", "Takitount", "Talemine", "Tamedroust", "Tamezguida", "Tammezguida", "Tamourzaia", "Tamorza", "Tamtaït", "Tamtaïte", "Tamurzaia", "Tamurzaïa", "Tamurzaia", "Tamuzaia", "Tamuzaia Nord", "Tamuzaia Ouest", "Tamuza'ïa", "Tamuza'ia", "Tamuzaia"] },
  { code: "27-Mostaganem", communes: ["Mostaganem", "Sétif", "Aïn Nokhla", "Sidi Lakhdar", "Achacha", "Aïn Tedles", "Ouled Brahim", "Ouled Cheikh", "Teslaline", "Zakhaïa", "Bekhedda", "Benkada", "Benkaïa", "Benkaïa Nord", "Benkaïa Ouest", "Benkaïenne"] },
  { code: "28-M'Sila", communes: ["M'Sila", "Bou Saâda", "Hadjeba", "Takhlit", "Menaa", "Ain Melila", "Ain Ouled Djemaa", "Ain Tine", "Aïn Tinichine", "Aïn Yabbes", "Aïn Yabbes Nord", "Aïn Yabbes Ouest", "Aïn Yabbès", "Aïn Yabbés", "Aïn Yabbess", "Aïn Yabbessa", "Aïn Yabbessah", "Aïn Yabbessé", "Aïn Yabbesse Est", "Aïn Yabbesse Nord", "Aïn Yabbesse Ouest", "Aïn Yabbessée", "Aïn Yabbessea", "Aïn Yabbessée"] },
  { code: "29-Mascara", communes: ["Mascara", "Ghriss", "Sidi Abdelmoumen", "Aïn Fares", "Arghenane", "Aïn Ouled Djemaa", "Aïn Ouled Fares", "Aïn Ouled Faress", "Aïn Ouled Farèss", "Aïn Ouled Farès", "Aïn Ouled Farès Nord", "Aïn Ouled Farès Ouest"] },
  { code: "30-Ouargla", communes: ["Ouargla", "Hassi Messaoud", "Touggourt", "Rouissat", "Ain Beida", "Ben Naceur", "Elsaada", "Hassi Deloul", "Hassi Messaoud", "Hassi Messaoud Nord", "Hassi Messaoud Ouest", "Hassi Messaoudien", "Hassi Messaoudienne", "Hassi Messaoudienne Nord", "Hassi Messaoudienne Ouest"] },
  { code: "31-Oran", communes: ["Oran", "Sidi Bouazza", "Es Sénia", "Tadjenanet", "Bir El Djir", "Ain Turk", "Arzew", "Aïn El Turk", "Aïn Turk Nord", "Aïn Turk Ouest", "Aïn Turka", "Aïn Turkaine", "Aïn Turkaise", "Aïn Turkaïne", "Aïn Turkane", "Aïn Turkanne", "Aïn Turkaïne", "Aïn Turkate"] },
  { code: "32-El Bayadh", communes: ["El Bayadh", "Aïn Ben Khelil", "Boualem", "Ain Ouled Djellal", "Ain Sefra", "Borg", "Dakhla", "El Hounet", "Hafiane", "Ouled Belhadj", "Rogassa", "Souïa", "Tiout", "Tourkia"] },
  { code: "33-Illizi", communes: ["Illizi", "Djanet", "In-Amenas", "Araouane", "Ghat", "In Gall", "In Guezzam", "Inakoussen", "Inakoussen Nord", "Inakoussen Ouest", "Inakoussenne"] },
  { code: "34-Bordj Bou Arreridj", communes: ["Bordj Bou Arreridj", "Mansoura", "Sidi Khaled", "Bir Tochal", "Aïn Taghrout", "Aïn Yebna", "Aïn Yebna Nord", "Aïn Yebna Ouest", "Aïn Yebna Ouest", "Aïn Yebna Sud"] },
  { code: "35-Boumerdes", communes: ["Boumerdès", "Thénia", "Khemisset", "Ouled Moussa", "Aïn Benian", "Aïn Benian Nord", "Aïn Benian Ouest", "Aïn Benianaise", "Aïn Beniane", "Aïn Benianaise", "Aïn Beniane", "Aïn Beniania"] },
  { code: "36-El Tarf", communes: ["El Tarf", "Drean", "Chbouti", "Bouhadjar", "Chetifou", "Ain Azel", "Ain Beida", "Ain Beida Nord", "Ain Beida Ouest", "Ain Beida Ouest", "Ain Beidaise", "Ain Beidane", "Ain Beidiaine"] },
  { code: "37-Tindouf", communes: ["Tindouf", "Tifariti", "Oum Djarane", "Aouinet"] },
  { code: "38-Tissemsilt", communes: ["Tissemsilt", "Theniet El Had", "Lamtar", "Aïn Bentili", "Aïn Benaceur", "Aïn Benaceur Nord", "Aïn Benaceur Ouest", "Aïn Benacroise", "Aïn Benacère"] },
  { code: "39-El Oued", communes: ["El Oued", "Hassi Ameziane", "Touggourt", "Guemara", "Robbah", "Ain Beida", "Ain Beida Nord", "Ain Beida Ouest", "Ain Beida Ouest", "Ain Beidaise"] },
  { code: "40-Khenchela", communes: ["Khenchela", "Chelia", "Yabous", "Babar", "Chechar", "Aïn Oulem", "Aïn Oulem Nord", "Aïn Oulem Ouest", "Aïn Oulème", "Aïn Oulemoise", "Aïn Oulemine", "Aïn Oulemine Nord", "Aïn Oulemine Ouest", "Aïn Oulemine Ouest", "Aïn Oulemine Sud"] },
  { code: "41-Souk Ahras", communes: ["Souk Ahras", "Ksar Sbahi", "Mecta", "Kheireddine", "Oued Zenati", "Ain Fouara", "Ain Fouara Nord", "Ain Fouara Ouest", "Ain Fouraise", "Ain Fouaraine", "Ain Fouaraine"] },
  { code: "42-Tipaza", communes: ["Tipasa", "Chenoua", "Koléa", "Ténès", "Sidi Ghiles", "Ain El Hammam", "Aïn El Hammam Nord", "Aïn El Hammam Ouest", "Aïn El Hammamaise", "Aïn El Hammamine"] },
  { code: "43-Mila", communes: ["Mila", "Taher", "Oued Seguin", "Barhamou", "Ferdjioua", "Ain Benian", "Ain Benian Nord", "Ain Benian Ouest", "Ain Benianaise", "Ain Beniane"] },
  { code: "44-Ain Defla", communes: ["Aïn Defla", "Aïn Ouassara", "Khémis Miliana", "Rouissat", "Ain Defla Nord", "Ain Defla Ouest", "Aïn Defla", "Aïn Deflaise"] },
  { code: "45-Naama", communes: ["Naâma", "Mécheria", "Aïn Sefra", "Ain Onougueur", "Ain Sefra Nord", "Ain Sefra Ouest", "Ain Sefraise"] },
  { code: "46-Ain Temouchent", communes: ["Aïn Temouchent", "Ain Tolba", "Oued Berkeche", "Nedroma", "Ain Tolba Nord", "Ain Tolba Ouest", "Ain Tolbaise", "Ain Tolbane"] },
  { code: "47-Ghardaia", communes: ["Ghardaïa", "Berriane", "Melika", "Zelfana", "Bounoura", "Ben Isguine", "Benisguène", "Benisguine", "Benisguine Nord", "Benisguine Ouest", "Benisguinine", "Benisguinine"] },
  { code: "48-Relizane", communes: ["Relizane", "Ouled Mimoun", "Mazouna", "Sidi Ali Boussidi", "Gueltouti", "Ain Ouled Bey", "Aïn Ouled Bey Nord", "Aïn Ouled Bey Ouest", "Aïn Ouled Beyaise", "Aïn Ouled Beyane"] },
  { code: "49-Timimoun", communes: ["Timimoun", "Adrar", "Akabli", "Araouane"] },
  { code: "50-Bordj Badji Mokhtar", communes: ["Bordj Badji Mokhtar", "Araouane", "Araouane Nord", "Araouane Ouest", "Araouanaise", "Araouanaise"] },
  { code: "51-Ouled Djellal", communes: ["Ouled Djellal", "Hassi Bahbah", "Megarine", "Megarine Nord", "Megarine Ouest", "Megarinine"] },
  { code: "52-Beni Abbes", communes: ["Béni Abbès", "Tamanrasset", "Adrar", "Tamanrasset Nord", "Tamanrasset Ouest", "Tamanrassétienne"] },
  { code: "53-In Salah", communes: ["In Salah", "Araouane", "Tamanrasset", "Araouane Nord", "Araouane Ouest", "Araouanaise"] },
  { code: "54-In Guezzam", communes: ["In Guezzam", "Tamanrasset", "Illizi", "Tamanrasset Nord", "Tamanrasset Ouest", "Tamanrassétienne"] },
  { code: "55-Touggourt", communes: ["Touggourt", "Ouargla", "Oran", "Ouargla Nord", "Ouargla Ouest", "Ourgalaise"] },
  { code: "56-Djanet", communes: ["Djanet", "Illizi", "Araouane", "Illizi Nord", "Illizi Ouest", "Illizienne"] },
  { code: "57-El M'Ghair", communes: ["El M'Ghair", "El Oued", "Ouargla", "El Oued Nord", "El Oued Ouest", "El Ouédienne"] },
  { code: "58-El Meniaa", communes: ["El Meniaa", "Ghardaïa", "Ouargla", "Ghardaïa Nord", "Ghardaïa Ouest", "Ghardaïenne"] },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wilaya, setWilaya] = useState("");
  const [adresse, setAdresse] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [commune, setCommune] = useState("");
  const [zoomImage, setZoomImage] = useState("");
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: "50%", y: "50%" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProduct({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) setTotalPrice((Number(product.price) || 0) * quantity);
  }, [quantity, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !wilaya || !adresse || !phoneNumber || !commune) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      await addDoc(collection(db, "product_orders"), {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        wilaya,
        commune,
        adresse,
        phoneNumber,
        clientName: fullName,
        totalPrice: Number(totalPrice),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setQuantity(1);
      setWilaya("");
      setCommune("");
      setAdresse("");
      setPhoneNumber("");
      setFullName("");
      setMessage("Commande envoyee avec succes.");
    } catch (error) {
      console.error(error);
      setMessage(error?.message || "Erreur lors de l'envoi de la commande.");
    }
  };

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (!product) return <p className="text-center mt-5">Produit introuvable.</p>;

  // Normalize image URLs from different possible product payloads
  let sliderImages = [];

  const normalizeImageUrl = (value) => {
    if (!value) return null;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
        try {
          return JSON.parse(trimmed);
        } catch {
          // Ignore and fallback to comma parsing
        }
      }
      return trimmed;
    }
    return value;
  };

  const rawImages = normalizeImageUrl(product.imageURLs);
  if (Array.isArray(rawImages)) {
    sliderImages = rawImages
      .map((item) => (typeof item === "string" ? item.trim() : item?.url || item?.imageURL || ""))
      .filter((item) => typeof item === "string" && item.trim());
  } else if (typeof rawImages === "string") {
    sliderImages = rawImages.split(",").map((url) => url.trim()).filter((url) => url);
  }

  // If no gallery images, use main image
  const mainImage = normalizeImageUrl(product.imageURL);
  if (sliderImages.length === 0 && mainImage) {
    sliderImages = [mainImage];
  }
  const generatedOldPrice = Math.round((Number(product.price) || 0) * 1.2);
  const productSpecs = [];
  const productHighlights = product.highlights || [
    { icon: <FaTruck />, text: "Livraison pro sous 48h" },
    { icon: <FaCheckCircle />, text: "Stock vérifié et prêt à expédier" },
    { icon: <FaShieldAlt />, text: "Support commercial dédié Velora" },
  ];

  const NextArrow = ({ onClick }) => (
    <button className="pd-arrow pd-arrow-next" type="button" onClick={onClick} aria-label="Suivante">
      <FaChevronRight />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="pd-arrow pd-arrow-prev" type="button" onClick={onClick} aria-label="Précédente">
      <FaChevronLeft />
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="pd-page">
      <div className="container py-5">
        <div className="pd-hero">
          <Link to="/market" className="pd-back-link">
            <FaArrowLeft /> Retour au store
          </Link>
          <span className="pd-hero-badge">Velora Pro</span>
          <h1 className="pd-hero-title">{product.name}</h1>
          <p className="pd-hero-text">Page produit professionnelle Velora : commande rapide, stock certifié et expérience B2B optimisée.</p>
        </div>

        {productSpecs.length > 0 && (
        <div className="pd-meta-grid">
          {productSpecs.map((item) => (
            <div key={item.label} className="pd-meta-item">
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
        )}

        <div className="pd-wrapper row g-4">
          <div className="col-lg-7">
            <div className="pd-slider-wrap">
              {sliderImages.length > 1 && (
                <div className="pd-slider-hint">
                  <FaChevronRight /> Voir d'autres images
                </div>
              )}
              {sliderImages.length > 0 ? (
                <Slider {...sliderSettings}>
                  {sliderImages.map((url, index) => (
                    <div key={index} className={`pd-slide${zoomActive && zoomImage === url ? " pd-slide-zoomed" : ""}`}>
                      <img
                        src={url}
                        alt={`${product.name} ${index + 1}`}
                        onClick={(event) => {
                          const rect = event.currentTarget.getBoundingClientRect();
                          const x = ((event.clientX - rect.left) / rect.width) * 100;
                          const y = ((event.clientY - rect.top) / rect.height) * 100;
                          if (zoomActive && zoomImage === url) {
                            setZoomActive(false);
                            return;
                          }
                          setZoomImage(url);
                          setZoomOrigin({ x: `${x}%`, y: `${y}%` });
                          setZoomActive(true);
                        }}
                        onMouseMove={(event) => {
                          if (!zoomActive || zoomImage !== url) return;
                          const rect = event.currentTarget.getBoundingClientRect();
                          const x = ((event.clientX - rect.left) / rect.width) * 100;
                          const y = ((event.clientY - rect.top) / rect.height) * 100;
                          setZoomOrigin({ x: `${x}%`, y: `${y}%` });
                        }}
                        style={zoomActive && zoomImage === url ? { transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}` } : {}}
                      />
                      <div className="pd-zoom-badge">
                        <FaSearchPlus /> Cliquer pour zoomer
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="pd-placeholder-image">Image indisponible</div>
              )}
            </div>

            <div className="pd-highlights">
              {productHighlights.map((item, index) => (
                <div key={index} className="pd-highlight-item">
                  <span className="pd-highlight-icon">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <div className="pd-landing-copy">
              <h5>Pourquoi choisir Velora ?</h5>
              <ul>
                <li>Photos et détails optimisés pour décision rapide.</li>
                <li>Commande fluide avec suivi et support pro dédié.</li>
                <li>Prix transparent, stock réel et livraison fiable.</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="pd-price-box">
              <div className="pd-old-price">{generatedOldPrice.toLocaleString()} DZD</div>
              <div className="pd-new-price">{(Number(product.price) || 0).toLocaleString()} DZD</div>
              <span className="pd-offer">Offre spéciale Velora</span>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit} className="pd-form">
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantite</label>
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>-</button>
                  <input type="text" className="form-control text-center mx-2" value={quantity} readOnly style={{ maxWidth: "90px" }} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Wilaya</label>
                <select 
                  className="form-select" 
                  value={wilaya} 
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setCommune("");
                  }}
                >
                  <option value="">Selectionner</option>
                  {wilayas.map((w) => <option key={w.code} value={w.code}>{w.code}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Commune</label>
                <select 
                  className="form-select" 
                  value={commune} 
                  onChange={(e) => setCommune(e.target.value)}
                  disabled={!wilaya}
                >
                  <option value="">Selectionner une commune</option>
                  {wilaya && wilayas.find(w => w.code === wilaya)?.communes.map((comm) => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Adresse</label>
                <input type="text" className="form-control" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Telephone</label>
                <input type="text" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>

              <div className="mb-4">
                <label className="form-label">Total (DZD)</label>
                <input type="number" className="form-control" value={totalPrice} readOnly />
              </div>

              <button type="submit" className="btn pd-submit-btn w-100">
                <FaShoppingCart style={{ marginRight: "0.6rem" }} />
                Commander maintenant
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
