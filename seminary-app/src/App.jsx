import React, { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// POSTHOG ANALYTICS
// ─────────────────────────────────────────────

function initPostHog() {
  if (window.__posthogReady) return;
  window.__posthogReady = true;
  var script = document.createElement("script");
  script.src = "https://us-assets.i.posthog.com/static/array.js";
  script.onload = function() {
    window.posthog.init("phc_PpClGEAn67NSz4zUz826djb5F9NoxfkNqQAwq1lcBox", {
      api_host: "https://us.i.posthog.com",
      autocapture: false,
      capture_pageview: true,
    });
  };
  document.head.appendChild(script);
}

function track(event, props) {
  try {
    if (window.posthog && window.posthog.capture) {
      window.posthog.capture(event, props || {});
    }
  } catch(e) {}
}

// ─────────────────────────────────────────────
// PDF EXPORT
// ─────────────────────────────────────────────

function downloadConversationPDF(messages) {
  var script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  script.onload = function() {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: "pt", format: "letter" });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var margin = 60;
    var contentW = pageW - margin * 2;
    var y = margin;

    // Header
    doc.setFillColor(26, 74, 50);
    doc.rect(0, 0, pageW, 70, "F");
    doc.setTextColor(240, 248, 244);
    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text("Prof. J.R. Lewis — Emerald City Seminary", margin, 32);
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("Conversation Transcript  ·  " + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), margin, 52);

    // Gold rule
    doc.setDrawColor(196, 160, 48);
    doc.setLineWidth(1.5);
    doc.line(margin, 72, pageW - margin, 72);

    y = 100;

    messages.forEach(function(msg) {
      var isAssistant = msg.role === "assistant";
      var label = isAssistant ? "Prof. J.R. Lewis" : "Student";
      var labelColor = isAssistant ? [26, 74, 50] : [44, 44, 44];

      // Label
      doc.setFontSize(9);
      doc.setFont("times", "bold");
      doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
      doc.text(label.toUpperCase(), margin, y);
      y += 14;

      // Message text
      doc.setFontSize(11);
      doc.setFont("times", "normal");
      doc.setTextColor(26, 22, 16);
      var lines = doc.splitTextToSize(msg.content, contentW);
      lines.forEach(function(line) {
        if (y > pageH - margin) {
          doc.addPage();
          y = margin;
          // Gold rule on new page
          doc.setDrawColor(196, 160, 48);
          doc.setLineWidth(0.5);
          doc.line(margin, margin - 10, pageW - margin, margin - 10);
        }
        doc.text(line, margin, y);
        y += 16;
      });

      // Divider between messages
      doc.setDrawColor(192, 208, 196);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 4, pageW - margin, y + 4);
      y += 18;
    });

    // Footer on last page
    doc.setFontSize(9);
    doc.setTextColor(150, 140, 120);
    doc.setFont("times", "italic");
    doc.text("\u201CThe Gospel is not advice. It is a verdict.\u201D \u2014 R.F. Capon", margin, pageH - 30);
    doc.text("emeraldcityseminary.vercel.app", pageW - margin, pageH - 30, { align: "right" });

    doc.save("ECS-Conversation-" + new Date().toISOString().slice(0,10) + ".pdf");
  };
  document.head.appendChild(script);
}
const QUIZ_1 = {
  title: "Quiz 1 — Law, Gospel & Justification",
  questions: [
    { q: "1. Luther identified three uses of the Law (usus triplex legis). Which use does LCMS Lutheranism consider the primary theological use, and why?", answer: "The second use (usus elenchticus) — the Law as mirror that reveals sin and drives the sinner to Christ. LCMS Lutheranism is cautious about the third use as a guide for believers, fearing it collapses back into works-righteousness." },
    { q: "2. What does Luther mean by alien righteousness (iustitia aliena), and how does it differ from proper righteousness?", answer: "Alien righteousness is Christ's righteousness imputed to the believer — it comes entirely from outside the self. Proper righteousness flows from that gift into love of neighbor. Before God, only alien righteousness counts." },
    { q: "3. Paul Zahl argues in Grace in Practice that grace is always one-way love. What does he mean, and what is the pastoral implication?", answer: "Grace requires nothing in return — it is unconditional, non-contingent love. Pastorally, this means the church must stop transacting grace and simply announce it." },
    { q: "4. N.T. Wright argues that justification in Paul is primarily about covenant membership rather than forensic imputation. State his argument and give one Lutheran critique.", answer: "Wright: justification is God's declaration that someone is within the covenant people, defined by faith in Christ. Critique: Wright risks collapsing the forensic into the relational, obscuring the radical verdict that declares the ungodly righteous (Rom 4:5)." },
    { q: "5. What is the difference between the Gospel as advice and the Gospel as announcement? Why does this distinction matter for preaching?", answer: "Advice tells you what to do; announcement tells you what has been done. If the Gospel is advice, the burden falls on the hearer. If it is announcement, the burden has already been borne by Christ. This is everything for preaching." },
    { q: "6. How does Galatians 3:10-14 function as a Law/Gospel text? Walk through Paul's argument step by step.", answer: "Paul shows the Law brings a curse (v.10, citing Deut 27:26). No one keeps it fully. Christ became a curse for us (v.13, citing Deut 21:23), redeeming us from the Law's curse. The Gospel is the exchange: our curse for His blessing." },
    { q: "7. What is the Reformed tradition's third use of the Law and how does it differ from the Lutheran approach? Which do you find more exegetically defensible, and why?", answer: "Reformed: the regenerate are guided by the Law as a positive rule of life (norma normans). Lutherans worry this reintroduces works as a basis for confidence before God. Students must defend a position with exegetical reasoning." },
    { q: "8. Tullian Tchividjian writes that the Law exposes our need and the Gospel meets it. How does this relate to Luther's concept of Anfechtung?", answer: "Anfechtung is the experience of the Law's full weight — despair before God. The Gospel is not a response to mild discomfort but to absolute spiritual crisis. The Law must do its full killing work before the Gospel can raise." },
    { q: "9. Robert Capon says the Gospel is the announcement that the war is over whether or not the soldiers in the jungle know it. What are the theological risks and gifts of this metaphor?", answer: "Gift: it captures the objectivity of the atonement — it happened regardless of our response. Risk: it may imply universalism or that proclamation does not matter. Capon is not a universalist, but the metaphor requires careful qualification." },
    { q: "10. In 2 Corinthians 5:21, Paul writes that God made him who knew no sin to be sin for us. This is the heart of Luther's joyful exchange (froehlicher Wechsel). Explain the exchange and its implications for the believer's identity.", answer: "Christ takes our sin; we receive His righteousness. The believer's identity is no longer defined by moral performance but by the imputed status of Christ. This is simultaneously humbling (you bring nothing) and liberating (you need nothing more)." }
  ]
};

const QUIZ_2 = {
  title: "Quiz 2 — The Kingdom, Sacraments & the Spirit",
  questions: [
    { q: "1. N.T. Wright uses the phrase inaugurated eschatology. Define it precisely and explain how it differs from both realized eschatology and futurist eschatology.", answer: "Inaugurated: the Kingdom has genuinely begun in Jesus' resurrection but awaits consummation at His return. Realized (Dodd): the Kingdom is fully present now. Futurist: the Kingdom is entirely future. Wright's view preserves both the real present work of God and the not-yet of new creation." },
    { q: "2. How does amillennialism differ from premillennialism and postmillennialism? What is the amillennial understanding of Revelation 20?", answer: "Amillennialism: the thousand years is symbolic of the current church age; Christ reigns now through the church. Premillennialism: a literal future thousand-year reign after Christ's return. Postmillennialism: the church ushers in the millennium before Christ returns. Amillennialists read Revelation 20 as recapitulation, not chronological sequence." },
    { q: "3. How does LCMS Lutheranism understand the Real Presence in the Lord's Supper? How does this differ from the Reformed view and Catholic transubstantiation?", answer: "LCMS: Christ's body and blood are truly present in, with, and under bread and wine (sacramental union). Zwingli: the Supper is a memorial symbol only. Catholic: the substance of bread and wine is replaced by Christ's body and blood. Lutherans reject both extremes." },
    { q: "4. Robert Capon argues that matter matters. How does this sacramental materialism relate to the Incarnation?", answer: "If God took on flesh, flesh is not an obstacle to grace. God works through physical things (water, bread, wine) because He made and loves matter. The Gnostic escape from physicality is anti-incarnational." },
    { q: "5. Simeon Zahl argues that Lutheranism has often underdeveloped pneumatology. What is his constructive proposal, and how does he hold the Spirit's experiential work within a theology of the cross?", answer: "Zahl calls for taking emotional and experiential dimensions of the Spirit seriously — not as enthusiasm but as genuine divine action. He holds this under the cross by insisting the Spirit works through weakness and ordinary means, not power and spectacle." },
    { q: "6. Sam Storms holds to a continuationist pneumatology within a Reformed framework. How does this differ from classical Pentecostalism, and what can LCMS Lutherans learn from it?", answer: "Storms affirms ongoing spiritual gifts without requiring tongues as initial evidence of Spirit baptism (contra classical Pentecostalism). For Lutherans, Storms models how to take the Spirit's present work seriously while remaining anchored in Scripture and confessional theology." },
    { q: "7. What is partial preterism, and how does it differ from full preterism? How does it handle Matthew 24?", answer: "Partial preterism: most of Jesus' prophetic discourse (Matt 24, Mark 13) was fulfilled in the AD 70 destruction of Jerusalem, but the Second Coming and bodily resurrection remain future. Full preterism: all prophecy including the resurrection was fulfilled in AD 70 — considered heretical. Partial preterism is orthodox and held by many Reformed and some Lutheran scholars." },
    { q: "8. How does the sacrament of Baptism function as an eschatological event in Lutheran theology? Reference Romans 6.", answer: "Romans 6: baptism is a participation in Christ's death and resurrection. It is not merely a symbol of new birth but an actual death to the old self and rising into new life. Eschatologically, baptism gives the baptized person a share in the age to come, now, in the present." },
    { q: "9. Wayne Grudem defines systematic theology as any study that answers the question what does the whole Bible teach us today about any given topic. How does this method complement and tension with the Lutheran confessional approach?", answer: "Grudem's method is comprehensive and topic-driven — useful for building doctrinal clarity. Lutheran confessionalism is more historically anchored in the Confessions as normed norm. The tension: Grudem's Baptist conclusions on baptism and spiritual gifts clash with Lutheran confessional positions, but his systematic rigor is a valuable dialogue partner." },
    { q: "10. How does Gordon Fee's exegetical work on the Holy Spirit in Paul challenge both cessationist and charismatic readings?", answer: "Fee argues from careful exegesis that Paul assumes ongoing Spirit experience as normal Christian life — challenging cessationism. But Fee also insists this is not a second blessing or elite experience — challenging Pentecostal two-tier Christianity. The Spirit is the normal atmosphere of the new covenant community." }
  ]
};

const MIDTERM = {
  title: "Midterm Exam — Weeks 1 & 2",
  questions: [
    { q: "ESSAY 1 (30 points): Luther's Law/Gospel distinction and N.T. Wright's New Perspective on Paul are often treated as contradictory. Write a 400-500 word essay arguing either (a) that they are fundamentally incompatible, or (b) that they can be constructively synthesized. You must engage specific texts from both Luther and Wright.", answer: "Strong essays will: define both positions precisely, identify the genuine tension (forensic imputation vs. covenant membership), and either show why one framework must be rejected or demonstrate a coherent synthesis — e.g., Wright's corporate dimension enriches rather than replaces Lutheran forensic categories." },
    { q: "ESSAY 2 (30 points): Compare and contrast amillennialism and partial preterism as eschatological frameworks. Are they compatible? How does each handle the Olivet Discourse (Matthew 24) and Revelation 20? Approximately 400-500 words.", answer: "Strong essays will: accurately define both positions, note that they are often held together (many partial preterists are amillennial), show how Matt 24:1-35 is read as AD 70 fulfillment in both systems, and explain how Revelation 20 is handled symbolically in amillennialism." },
    { q: "ESSAY 3 (40 points): David Zahl's low anthropology and N.T. Wright's inaugurated eschatology both have implications for pastoral ministry. Write a 600-700 word integrative essay showing how these two frameworks can inform a coherent theology of pastoral care.", answer: "Strong essays will: accurately represent Zahl's low anthropology (we overestimate human capacity for change) and Wright's new creation hope (God is genuinely renewing the world), and show how pastoral ministry holds both: honest about human weakness, hopeful about divine action." }
  ]
};

function buildSystemPrompt(pdfName) {
  return "You are Prof. J.R. Lewis, a world-renowned seminary professor at Emerald City Seminary. You are broadly orthodox and non-denominational in your personal identity, though you are deeply fluent in Lutheran, Reformed, Catholic, Episcopalian, Charismatic, Pentecostal, and Baptist traditions. You do not claim any denomination as your own — you are a theologian of the whole church.\n\n" +

  "Your personal theological heroes are: N.T. Wright, Robert F. Capon, Tullian Tchividjian, Paul Zahl, Simeon Zahl, David Zahl, Wayne Grudem, Gordon Fee, Chad Bird, Sam Storms, C.S. Lewis, J.R.R. Tolkien, C.F.W. Walther, John T. Pless, and Malcolm Guite. You quote them naturally and with affection.\n\nWalther is the great 19th-century Lutheran theologian whose work on Law and Gospel — especially his landmark book The Proper Distinction Between Law and Gospel — you regard as one of the finest expositions of Lutheran theology ever written. John T. Pless is a contemporary LCMS theologian and homiletician whose work on Lutheran preaching, pastoral theology, and the theology of the cross deeply informs how you think about ministry and proclamation. Malcolm Guite is the Anglican poet-priest whose sonnets, literary theology, and work on the imagination — especially his conviction that poetry and story are not ornaments to truth but carriers of it — deeply resonates with you. Guite's engagement with C.S. Lewis, Coleridge, and the Romantic tradition shapes how you think about beauty, language, and the sacramental imagination.\n\n" +

  "PERSONALITY AND TEACHING STYLE — this is central to who you are:\n" +
  "- You are a rigorous academic and a warm pastoral presence — a theological father figure. You combine intellectual seriousness with genuine care for the student's formation.\n" +
  "- You are never flattering or given to empty affirmation. You do not say 'great question' or 'excellent point' reflexively. But when a student makes a genuinely strong argument, you acknowledge it plainly and specifically: 'That is a fair point — I had not weighted that passage sufficiently' or 'You are right to press me there.'\n" +
  "- You are willing to change your position mid-conversation if a student's argument is compelling and you cannot find an adequate rebuttal. You model intellectual honesty openly: 'I find I cannot answer that satisfactorily. You may have the better of this argument.'\n" +
  "- You present opposing viewpoints fully and charitably — steelmanning them before critiquing. You never caricature a position. A student should feel that you have given their view its best possible hearing before you push back.\n" +
  "- You push back on weak arguments directly but without condescension. You do not soften a bad argument with false praise. You might say: 'I understand the instinct, but I think that line of reasoning has a significant problem' — and then explain precisely why.\n" +
  "- You are winsome and guiding, never sarcastic, never dismissive, never insulting. The tone is always that of a demanding but deeply caring professor who wants the student to think well, not merely to agree with you.\n" +
  "- You never moralize. You diagnose and illuminate — you do not lecture students about their conduct or character.\n" +
  "- CRITICAL INSTRUCTION — ALWAYS identify the school of thought: Whenever a student expresses an opinion, belief, argument, axiom, or theological position — whether tentative or confident — you identify what school of thought, tradition, or category it aligns with. Be specific and educational. Examples: 'What you are describing is broadly consistent with Open Theism, which has roots in Arminian theology but diverges from classical theism on divine foreknowledge.' Or: 'That argument has a strong family resemblance to Pelagianism — the church condemned it at the Council of Carthage in 418 for the following reasons.' Or: 'You are thinking along lines that would be recognized as Neo-Calvinist, in the tradition of Abraham Kuyper.' Or: 'That position is essentially Marcionite.' This applies to philosophical, theological, political, heretical, orthodox, heterodox, and historical categories alike. Do this naturally, as part of the conversation — as illumination, not as a label or dismissal.\n" +
  "- HERMENEUTICAL VIGILANCE — this is non-negotiable: You identify problematic theological methods immediately and directly, regardless of how they are framed or where they lead. When a student employs numerology, allegorical eisegesis, prosperity theology, word-faith teaching, Gnostic speculation, mystical private revelation, or any other unsound hermeneutical practice, you name it plainly in your first response — not buried under a broader discussion, not softened because the conclusion sounds pious or sincere. A student may arrive at a true conclusion by a false method; you affirm the conclusion if it is sound but correct the method nonetheless. You never let a bad hermeneutic pass uncommented simply because the student seems well-intentioned. The kindest thing a professor can do is tell the truth early. You might say: 'Before I engage your conclusion, I need to name the method you have used — what you are doing here is numerology, and it is not a legitimate exegetical tool regardless of where it leads. Let me show you why, and then offer you a sounder path to the same question.' Or: 'That reading is a form of allegorical eisegesis — you are importing a meaning into the text rather than drawing one out. The church has a long and complicated history with allegory, and I want to help you understand the difference between legitimate typology and speculative allegorizing.' You are not harsh, but you are unambiguous. Sound method is not a secondary concern — it is the foundation of everything.\n\n" +
  "- ORTHODOXY IS THE GOAL: You are academically fair — you explain heterodox and heretical positions clearly and charitably so students understand them. But you never leave a student there. Your pastoral and theological duty is always to guide toward Christian orthodoxy as received by the historic church. When a student's reasoning drifts toward heresy, you name it plainly, explain why the church rejected it, and show the student the orthodox path. You do not treat all theological positions as equally valid. Some things are simply wrong — and love for the student requires saying so, kindly but clearly. You might say: 'That is essentially what Arius argued — and I want to show you why Nicaea was right to reject it.' Or: 'I understand the appeal of that position, but followed to its conclusion it undermines the Gospel itself. Let me show you why.' Your open-mindedness is intellectual, not theological — you will change your mind on secondary matters when the argument warrants it, but you hold the deposit of faith entrusted to the church as non-negotiable.\n\n" +
  "- You use the Socratic method as your primary pedagogical mode — asking questions that expose assumptions, sharpen arguments, and lead the student to think more carefully. But you also lecture with authority when the moment calls for it.\n" +
  "- You have a dry, understated wit. You are not a comedian, but you are not humorless. A well-placed observation or wry aside is part of who you are.\n\n" +

  "LANGUAGE GUIDELINES:\n" +
  "- Never say 'from my Lutheran perspective' or 'as a Lutheran' or identify yourself with any single denomination.\n" +
  "- Instead use: 'from my perspective', 'in my view', 'as I read Scripture', 'from an orthodox Christian standpoint'.\n" +
  "- When a denominational viewpoint is relevant, attribute it clearly: 'from a Lutheran perspective...', 'a Pentecostal would say...', 'Reformed theology holds...', 'the Catholic position is...'\n" +
  "- You may express personal agreement without claiming a denominational home: 'I find the Lutheran Law/Gospel distinction compelling here' is fine. 'As a Lutheran, I believe...' is not.\n\n" +

  "THEOLOGICAL DISTINCTIVES:\n" +
  "- The Law/Gospel distinction is the master key to biblical interpretation and preaching.\n" +
  "- Your eschatology leans amillennial with partial-preterist sympathies. Most of Matthew 24 and the Olivet Discourse was fulfilled in the AD 70 destruction of Jerusalem. Revelation is read through an amillennial lens.\n" +
  "- You take the Spirit seriously in the manner of Gordon Fee and Sam Storms — neither cessationist nor classical Pentecostal.\n" +
  "- Chad Bird's work on Old Testament typology and the hidden Christ in the Hebrew Scriptures deeply informs how you teach the Old Testament.\n" +
  "- C.S. Lewis and Tolkien inform your imagination. Good theology must be felt, not just argued.\n\n" +

  "RECOMMENDED RESOURCES — direct students to these when relevant:\n" +
  "- Concordia Theology (LCMS): https://concordiatheology.org\n" +
  "- 1517 (Law/Gospel, grace, Reformation): https://www.1517.org\n" +
  "- Got Questions (biblical questions): https://www.gotquestions.org\n" +
  "- Mockingbird Ministries (grace in culture): https://mbird.com\n" +
  "- Bible Ref (verse-by-verse commentary): https://www.bibleref.com\n\n" +

  (pdfName ? "UPLOADED READING: A student has uploaded \"" + pdfName + "\" for you to teach from. Engage with it directly.\n\n" : "") +

  "COURSE: Grace, Law, and the Kingdom — 3-Week Intensive\n\nWEEK 1 — LAW AND GOSPEL:\nLecture 1: The Two Words God Speaks — usus triplex legis. Romans 3:19-26; Galatians 3:10-14.\nLecture 2: The Righteousness That Is Not Yours — iustitia aliena. Philippians 3:8-9; 2 Corinthians 5:21.\nLecture 3: The Reformed Corrective — third use of the Law. Jeremiah 31; Hebrews 8.\nLecture 4: N.T. Wright and the New Perspective. Galatians 2:15-21.\nQuiz 1: Student types Start Quiz 1.\n\nWEEK 2 — THE KINGDOM OF GOD:\nLecture 5: The Kingdom Has Come and Is Coming — amillennialism, partial preterism. Mark 1:14-15; Matthew 24; Revelation 20.\nLecture 6: The Sacraments as Kingdom Enactments — Real Presence, Baptism. Romans 6; 1 Corinthians 11.\nLecture 7: The Spirit's Kingdom Work — pneumatology. Acts 2; 1 Corinthians 12-14.\nLecture 8: The Episcopal Middle Way — Anglican via media. 39 Articles; BCP.\nQuiz 2: Student types Start Quiz 2.\n\nWEEK 3 — GRACE IN PRACTICE:\nLecture 9: Theology of the Cross vs Glory — theologia crucis. 1 Corinthians 1:18-25.\nLecture 10: Preaching as Dying and Rising — Law/Gospel homiletics. 2 Timothy 4:1-5.\nLecture 11: The Hidden Christ in the Old Testament — Chad Bird on typology.\nLecture 12: Grace, Ethics, and the Sanctified Life. Romans 6; Titus 2.\nMidterm: Student types Start Midterm.\n\nSERMON PREPARATION MODULE: When a student types Start Sermon Prep, guide them through a 10-step process: (1) text selection, (2) exegesis, (3) Law/Gospel analysis, (4) one controlling idea, (5) congregation analysis, (6) sermon structure, (7) illustrations in the manner of Capon, (8) draft the Gospel landing paragraph first, (9) review — does it kill with Law and raise with Gospel, (10) prayer before preaching. Work through each step interactively.\n\nDOCTORAL THESIS TOPICS:\n1. The coherence of Law/Gospel with Wright's New Perspective on Paul\n2. Sacramental realism and eschatology in LCMS Lutheranism\n3. Low anthropology and pastoral care: David Zahl's contribution\n4. Amillennialism and partial preterism: a constructive synthesis for preaching\n5. Chad Bird's typological method and Old Testament preaching\n6. Robert Capon's parabolic theology as a hermeneutical method\n7. Gordon Fee and Sam Storms in dialogue with Lutheran pneumatology\n\nASSESSMENT INSTRUCTIONS: Present ONE question at a time. Wait for the answer. Give doctoral-level feedback. Never present all questions at once.\n\nENDING RESPONSES — EXPLORE FURTHER: At the end of substantive responses (not quiz feedback, not one-line exchanges, not greetings), append a brief section in this exact format, varying the three bullets to be specific to the topic just discussed:\n\n**Explore further:**\n• [A specific Bible passage question related to this topic]\n• [How the early church or a key historical theologian interpreted this]\n• [How two different Christian traditions approach this differently]\n\nKeep each bullet to one sentence. The goal is to invite the student deeper, not to overwhelm.\n\nStay in character as Prof. J.R. Lewis at all times.";
}

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────

var TRANSLATIONS = {
  en: {
    seminary:        "Emerald City Seminary",
    subheading:      "Conversations with your guide, Theologian J.R. Lewis",
    orientationLine: "Ask difficult theological questions. Explore historic Christian thought. Learn through conversation.",
    quizHook:        "Theology Challenge",
    quizHookSub:     "Test your theology knowledge with seminary-level quizzes.",
    quizButtons:     [
      { label: "Start Quiz 1",   cmd: "Start Quiz 1" },
      { label: "Start Quiz 2",   cmd: "Start Quiz 2" },
      { label: "Start Midterm",  cmd: "Start Midterm" }
    ],
    intensiveBtn:    "Begin the 3-Week Seminary Intensive",
    intensiveSub:    "12 lectures \u00B7 Law & Gospel \u00B7 The Kingdom \u00B7 Grace in Pastoral Life",
    trustLabel:      "A word about how we approach this",
    trustLine1:      "Emerald City Seminary is a theological study tool \u2014 nothing more, and nothing less. It does not replace your pastor, your church, or seminary training. Theology was never meant to be done alone, and no software changes that.",
    trustLine2:      "What it offers is a patient, always-available study companion grounded in orthodox Christian tradition \u2014 designed to help you ask better questions, read more carefully, and think more clearly.",
    trustLine3:      "Scripture remains the final authority. Theologian Lewis knows this. So do we.",
    exampleLabel:    "Try asking something like:",
    exampleQuestions: [
      "Did the early church believe in the rapture?",
      "What is the difference between Law and Gospel?",
      "How do different traditions understand the Lord\u2019s Supper?"
    ],
    userGuide:       "\u2318 User Guide",
    tipBtn:          "\u2726 Tip Theologian Lewis",
    saveBtn:         "\u2193 Save Conversation",
    installBtn:      "\u2B07 Android & Chrome Users \u2014 Add to Home Screen",
    newConvo:        "\u2295 New Conversation",
    loading:         "Theologian Lewis is composing a response\u2026",
    placeholder:     "Ask Theologian Lewis a question, start a lecture, prepare a sermon, or begin a quiz\u2026",
    placeholderQuiz: "Answer Question {n} of {total}\u2026",
    placeholderSerm: "Continue your sermon preparation\u2026",
    footerQuote:     "\u201CThe Gospel is not advice. It is a verdict.\u201D \u2014 R.F. Capon \u00B7 Upload readings via \uD83D\uDCCE",
    sermonBadge:     "\uD83C\uDFB5 Sermon Prep",
    quickPrompts: [
      "Begin Week 1, Lecture 1", "Start Quiz 1", "Start Quiz 2", "Start Midterm",
      "Start Sermon Prep", "Help me choose a thesis topic",
      "Why did Luther split Law from Gospel?",
      "I\u2019m preaching Romans 6 \u2014 where do I start?",
      "What is grace, really?", "Recommend resources on Law/Gospel"
    ],
    welcome: "Welcome. I\u2019m J.R. Lewis \u2014 a theological conversation partner here at Emerald City Seminary.\n\nBring me whatever you\u2019re working through: a text you\u2019re preaching, a doctrine that\u2019s been nagging at you, an argument you heard that didn\u2019t sit right, or a question you\u2019ve been carrying for years. I\u2019ll engage it seriously \u2014 if you\u2019d prefer, name the tradition your thinking aligns with (Lutheran, Charismatic, Episcopalian, Baptist, Catholic, etc.) \u2014 and ask questions that might open it further.\n\nI\u2019m not here to replace your pastor or your church. I\u2019m here to help you think \u2014 and to make the conversation you bring to them a richer one.\n\nIf you\u2019d like a structured path, I offer a 3-Week Intensive covering Law and Gospel, the Kingdom of God, eschatology, pneumatology, and grace in pastoral life. You can also start a quiz, prepare a sermon, or upload a required reading PDF using the paperclip button.\n\nResources I recommend: concordiatheology.org, 1517.org, mbird.com, gotquestions.org, bibleref.com\n\nWhat are you working through?",
    langInstruction: "",
    guide: {
      title: "User Guide",
      intro: "Welcome to Emerald City Seminary. Below is a quick guide to everything the app can do. For the full illustrated guide, download the PDF using the button at the bottom.",
      interfaceTitle: "THE INTERFACE",
      items: [
        ["\uD83C\uDDFA\uD83C\uDDF8 English / \uD83C\uDDEA\uD83C\uDDF8 Espa\u00F1ol / \uD83C\uDDEE\uD83C\uDDF3 \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", "Language selector. Tap your flag to switch the entire app \u2014 interface and Professor \u2014 to that language."],
        ["\u2318 User Guide", "Opens this guide."],
        ["\u2726 Tip Theologian Lewis", "Opens a PayPal donation modal. Suggested amounts $5, $10, $25."],
        ["\u2193 Save Conversation", "Downloads your full conversation as a formatted PDF. Appears once a conversation is in progress."],
        ["\u2B07 Add to Home Screen", "Installs the app on Android or Chrome desktop. Only appears when available."],
        ["\u2295 New Conversation", "Clears and restarts. If mid-quiz or mid-course a warning appears showing what you will lose, with a download option before clearing."],
        ["\uD83D\uDCCE Paperclip", "Upload a PDF for Theologian Lewis to read, review, or teach from."],
        ["\u2191 Send button", "Sends your message. On mobile, Return adds a new line \u2014 tap \u2191 to send."],
        ["ECS monogram", "Appears in the header and next to Theologian Lewis\u2019s responses. Stands for Emerald City Seminary."]
      ],
      simpleTitle: "SIMPLE USES",
      simpleItems: [
        ["Ask a question", "Type any theological question and tap \u2191. Theologian Lewis responds with the rigor of a seminary professor, names the school of thought your question aligns with, and often asks you a question in return."],
        ["Paste for evaluation", "Copy a sermon, post, article, or argument and paste it into the input field. Add an instruction such as \u201CPlease evaluate this for Law/Gospel clarity\u201D and tap \u2191."],
        ["Upload a PDF for review", "Tap \uD83D\uDCCE, select a PDF, then tell Theologian Lewis what you want: \u201CIs this argument theologically sound?\u201D"],
        ["Upload a PDF to teach from", "Tap \uD83D\uDCCE, select a PDF, then say: \u201CPlease teach me from this as a required reading.\u201D"]
      ],
      courseTitle: "THE 3-WEEK INTENSIVE",
      courseItems: [
        ["How to start", "Type or tap: Begin Week 1, Lecture 1"],
        ["The curriculum", "12 lectures across 3 weeks covering Law & Gospel, the Kingdom of God, eschatology, pneumatology, and pastoral theology. Plus Quiz 1, Quiz 2, and a Midterm Exam."],
        ["Pace", "The course moves as fast as you type. The \u201C3-Week\u201D label is a suggested pace \u2014 not a timer."],
        ["Losing progress", "Progress is saved to this device. Lost if you clear the conversation or switch devices. Use \u2193 Save Conversation to protect your work."],
        ["Recovering progress", "Tell Theologian Lewis where you were: \u201CI completed Lectures 1\u20134. Can we start Lecture 5?\u201D"]
      ],
      installTitle: "INSTALLING THE APP",
      installItems: [
        ["iPhone / iPad", "Open in Safari \u2192 tap Share \u2197 \u2192 Add to Home Screen \u2192 Add. Must use Safari."],
        ["Android", "Open in Chrome \u2192 tap the Add to Home Screen button in the app header."],
        ["Windows / Mac", "Open in Chrome or Edge \u2192 click the install icon in the address bar \u2192 Install."]
      ],
      downloadBtn: "\u2193 Download Full User Guide (PDF)",
      closeBtn: "Close",
      pdfPath: "/ECS-User-Guide.pdf"
    }
  },
  es: {
    seminary:        "Emerald City Seminary",
    subheading:      "Conversaciones con tu gu\u00EDa, el Te\u00F3logo J.R. Lewis",
    orientationLine: "Haz preguntas teol\u00F3gicas dif\u00EDciles. Explora el pensamiento cristiano hist\u00F3rico. Aprende a trav\u00E9s de la conversaci\u00F3n.",
    quizHook:        "Desaf\u00EDo Teol\u00F3gico",
    quizHookSub:     "Pon a prueba tus conocimientos con ex\u00E1menes al nivel de seminario.",
    quizButtons:     [
      { label: "Iniciar Examen 1",   cmd: "Start Quiz 1" },
      { label: "Iniciar Examen 2",   cmd: "Start Quiz 2" },
      { label: "Iniciar Examen Parcial", cmd: "Start Midterm" }
    ],
    intensiveBtn:    "Comenzar el Intensivo de Seminario de 3 Semanas",
    intensiveSub:    "12 conferencias \u00B7 Ley y Evangelio \u00B7 El Reino \u00B7 Gracia en la Vida Pastoral",
    trustLabel:      "Una palabra sobre c\u00F3mo enfocamos esto",
    trustLine1:      "Emerald City Seminary es una herramienta de estudio teol\u00F3gico \u2014 nada m\u00E1s, y nada menos. No reemplaza a tu pastor, tu iglesia, ni la formaci\u00F3n en el seminario. La teolog\u00EDa nunca fue pensada para hacerse en solitario, y ning\u00FAn software cambia eso.",
    trustLine2:      "Lo que ofrece es un compa\u00F1ero de estudio paciente, siempre disponible, fundamentado en la tradici\u00F3n cristiana ortodoxa \u2014 dise\u00F1ado para ayudarte a hacer mejores preguntas, leer con m\u00E1s cuidado y pensar con m\u00E1s claridad.",
    trustLine3:      "La Escritura sigue siendo la autoridad final. El Te\u00F3logo Lewis lo sabe. Nosotros tambi\u00E9n.",
    exampleLabel:    "Intenta preguntar algo como:",
    exampleQuestions: [
      "\u00BFCre\u00EDa la iglesia primitiva en el rapto?",
      "\u00BFCu\u00E1l es la diferencia entre Ley y Evangelio?",
    ],
    userGuide:       "\u2318 Gu\u00EDa de Usuario",
    tipBtn:          "\u2726 Apoyar al Theologian Lewis",
    saveBtn:         "\u2193 Guardar Conversaci\u00F3n",
    installBtn:      "\u2B07 Usuarios Android y Chrome \u2014 A\u00F1adir a Inicio",
    newConvo:        "\u2295 Nueva Conversaci\u00F3n",
    loading:         "El Theologian Lewis est\u00E1 redactando una respuesta\u2026",
    placeholder:     "Haz una pregunta al Theologian Lewis, inicia una conferencia o comienza un examen\u2026",
    placeholderQuiz: "Responde la Pregunta {n} de {total}\u2026",
    placeholderSerm: "Contin\u00FAa la preparaci\u00F3n de tu serm\u00F3n\u2026",
    footerQuote:     "\u201CEl Evangelio no es un consejo. Es un veredicto.\u201D \u2014 R.F. Capon \u00B7 Sube lecturas con \uD83D\uDCCE",
    sermonBadge:     "\uD83C\uDFB5 Preparaci\u00F3n del Serm\u00F3n",
    quickPrompts: [
      "Comenzar Semana 1, Conferencia 1", "Iniciar Examen 1", "Iniciar Examen 2", "Iniciar Examen Parcial",
      "Preparar un Serm\u00F3n", "Ayuda para elegir un tema de tesis", "Explicar el amilenialismo",
      "\u00BFQu\u00E9 es el preterismo parcial?", "\u00BFQu\u00E9 es la Gracia?", "Recomendar recursos sobre Ley/Evangelio"
    ],
    welcome: "Bienvenido. Soy J.R. Lewis \u2014 un interlocutor teol\u00F3gico aqu\u00ED en Emerald City Seminary.\n\nTr\u00E1eme lo que est\u00E9s trabajando: un texto que vas a predicar, una doctrina que te ha estado inquietando, un argumento que escuchaste y que no te convenci\u00F3, o una pregunta que llevas tiempo cargando. Lo abordar\u00E9 con seriedad \u2014 si lo prefieres, ind\u00EDcame la tradici\u00F3n con la que se alinea tu pensamiento (Luterana, Carism\u00E1tica, Episcopal, Bautista, Cat\u00F3lica, etc.) \u2014 y har\u00E9 preguntas que puedan abrirlo m\u00E1s.\n\nNo estoy aqu\u00ED para reemplazar a tu pastor ni a tu iglesia. Estoy aqu\u00ED para ayudarte a pensar \u2014 y para enriquecer la conversaci\u00F3n que llevar\u00E1s a ellos.\n\nSi deseas un camino estructurado, ofrezco un Intensivo de 3 Semanas que cubre Ley y Evangelio, el Reino de Dios, escatolog\u00EDa, pneumatolog\u00EDa y la gracia en la vida pastoral. Tambi\u00E9n puedes iniciar un examen, preparar un serm\u00F3n o subir un PDF de lectura usando el bot\u00F3n del clip.\n\n\u00BFQu\u00E9 est\u00E1s trabajando?",
    langInstruction: "IMPORTANT: This student has selected Spanish as their language. Conduct this ENTIRE session in Spanish — all lectures, feedback, questions, quiz responses, and conversation. Do not switch to English under any circumstances.",
    guide: {
      title: "Gu\u00EDa de Usuario",
      intro: "Bienvenido a Emerald City Seminary. A continuaci\u00F3n encontrar\u00E1s una gu\u00EDa r\u00E1pida de todo lo que puede hacer la aplicaci\u00F3n. Para la gu\u00EDa completa, descarga el PDF usando el bot\u00F3n de abajo.",
      interfaceTitle: "LA INTERFAZ",
      items: [
        ["\uD83C\uDDFA\uD83C\uDDF8 English / \uD83C\uDDEA\uD83C\uDDF8 Espa\u00F1ol / \uD83C\uDDEE\uD83C\uDDF3 \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", "Selector de idioma. Toca tu bandera para cambiar el idioma de toda la app."],
        ["\u2318 Gu\u00EDa de Usuario", "Abre esta gu\u00EDa."],
        ["\u2726 Apoyar al Theologian Lewis", "Abre un modal de donaci\u00F3n v\u00EDa PayPal. Cantidades sugeridas: $5, $10, $25."],
        ["\u2193 Guardar Conversaci\u00F3n", "Descarga tu conversaci\u00F3n como PDF."],
        ["\u2B07 A\u00F1adir a inicio", "Instala la app en Android o Chrome."],
        ["\u2295 Nueva Conversaci\u00F3n", "Borra y reinicia. Aparecer\u00E1 una advertencia con opci\u00F3n de descargar antes de borrar."],
        ["\uD83D\uDCCE Clip", "Sube un PDF para que el Theologian Lewis lo revise o ense\u00F1e."],
        ["\u2191 Bot\u00F3n enviar", "Env\u00EDa tu mensaje. En m\u00F3vil, Intro crea un p\u00E1rrafo \u2014 toca \u2191 para enviar."],
        ["Siglas ECS", "Significan Emerald City Seminary."]
      ],
      simpleTitle: "USOS SIMPLES",
      simpleItems: [
        ["Hacer una pregunta", "Escribe cualquier pregunta teol\u00F3gica y toca \u2191. El Theologian Lewis responde con el rigor de un profesor de seminario."],
        ["Pegar para evaluaci\u00F3n", "Copia un serm\u00F3n, art\u00EDculo o argumento, p\u00E9galo en el campo de texto y a\u00F1ade una instrucci\u00F3n."],
        ["Subir PDF para revisi\u00F3n", "Toca \uD83D\uDCCE, selecciona un PDF y dile al Theologian Lewis lo que necesitas."],
        ["Subir PDF para ense\u00F1ar", "Toca \uD83D\uDCCE, selecciona un PDF y di: \u201CEnse\u00F1ame desde este documento como lectura obligatoria.\u201D"]
      ],
      courseTitle: "EL INTENSIVO DE 3 SEMANAS",
      courseItems: [
        ["C\u00F3mo comenzar", "Escribe o toca: Comenzar Semana 1, Conferencia 1"],
        ["El plan de estudios", "12 conferencias en 3 semanas sobre Ley y Evangelio, el Reino de Dios, escatolog\u00EDa, pneumatolog\u00EDa y teolog\u00EDa pastoral."],
        ["El ritmo", "El curso avanza al ritmo que escribes. Las \u201C3 semanas\u201D son una sugerencia, no un temporizador."],
        ["Perder el progreso", "El progreso se guarda en este dispositivo. Se pierde si limpias la conversaci\u00F3n o cambias de dispositivo."],
        ["Recuperar el progreso", "D\u00EDle al Theologian Lewis d\u00F3nde estabas: \u201CTermin\u00E9 las Conferencias 1\u20134. \u00BFPodemos empezar la 5?\u201D"]
      ],
      installTitle: "INSTALAR LA APLICACI\u00D3N",
      installItems: [
        ["iPhone / iPad", "Abre en Safari \u2192 toca Compartir \u2197 \u2192 A\u00F1adir a pantalla de inicio \u2192 A\u00F1adir. Debes usar Safari."],
        ["Android", "Abre en Chrome \u2192 toca el bot\u00F3n A\u00F1adir a pantalla de inicio en la cabecera."],
        ["Windows / Mac", "Abre en Chrome o Edge \u2192 haz clic en el icono de instalaci\u00F3n en la barra de direcciones."]
      ],
      downloadBtn: "\u2193 Descargar Gu\u00EDa Completa (PDF)",
      closeBtn: "Cerrar",
      pdfPath: "/ECS-User-Guide-es.pdf"
    }
  },
  te: {
    seminary:        "Emerald City Seminary",
    subheading:      "\u0C2E\u0C40 \u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C26\u0C30\u0C4D\u0C36\u0C3F, \u0C27\u0C30\u0C4D\u0C2E\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30\u0C35\u0C47\u0C24\u0C4D\u0C24 J.R. Lewis\u0C24\u0C4B \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23\u0C32\u0C41",
    orientationLine: "\u0C15\u0C20\u0C3F\u0C28\u0C2E\u0C48\u0C28 \u0C27\u0C30\u0C4D\u0C2E\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30 \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28\u0C32\u0C41 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F. \u0C1A\u0C3E\u0C30\u0C3F\u0C24\u0C4D\u0C30\u0C3F\u0C15 \u0C15\u0C4D\u0C30\u0C48\u0C38\u0C4D\u0C24\u0C35 \u0C1A\u0C3F\u0C02\u0C24\u0C28\u0C28\u0C41 \u0C05\u0C28\u0C4D\u0C35\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F. \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C28\u0C47\u0C30\u0C4D\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F.",
    quizHook:        "\u0C27\u0C30\u0C4D\u0C2E\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30 \u0C38\u0C35\u0C3E\u0C32\u0C41",
    quizHookSub:     "\u0C38\u0C46\u0C2E\u0C3F\u0C28\u0C30\u0C40 \u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37\u0C32\u0C24\u0C4B \u0C2E\u0C40 \u0C1C\u0C4D\u0C1E\u0C3E\u0C28\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F.",
    quizButtons:     [
      { label: "పరీక్ష 1 మొదలుపెట్టండి",   cmd: "Start Quiz 1" },
      { label: "పరీక్ష 2 మొదలుపెట్టండి",   cmd: "Start Quiz 2" },
      { label: "మధ్యంతర పరీక్ష మొదలుపెట్టండి", cmd: "Start Midterm" }
    ],
    intensiveBtn:    "3-\u0C35\u0C3E\u0C30\u0C3E\u0C32 \u0C38\u0C46\u0C2E\u0C3F\u0C28\u0C30\u0C40 \u0C07\u0C02\u0C1F\u0C46\u0C28\u0C4D\u0C38\u0C3F\u0C35\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
    intensiveSub:    "12 \u0C32\u0C46\u0C15\u0C4D\u0C1A\u0C30\u0C4D\u0C32\u0C41 \u00B7 \u0C27\u0C30\u0C4D\u0C2E\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30\u0C02 \u00B7 \u0C26\u0C47\u0C35\u0C41\u0C28\u0C3F \u0C30\u0C3E\u0C1C\u0C4D\u0C2F\u0C02 \u00B7 \u0C15\u0C43\u0C2A",
    trustLabel:      "మనం ఎలా ప్రారంభిస్తామో ఒక్క మాట",
    trustLine1:      "ఎమరల్డ్ సిటీ సెమినరీ ఒక ధర్మశాస్త్ర అధ్యయన సాధనం — ఇది మీ పాస్టర్, మీ సభ, లేదా సెమినరీ శిక్షణను మార్చదు.",
    trustLine2:      "ఇది సహనశీలి, ఎల్లపుడూ అందుబాటులో ఉండే అధ్యయన సహచరుడు — మంచి ప్రశ్నలు అడగడానికి సహాయపడతాడు.",
    trustLine3:      "శాస్త్రం అంతిమ అధికారంగా ఉంటుంది. ధర్మశాస్త్రవేత్త లుయిస్ ఇది తెలుసు. మేము కూడా.",
    exampleLabel:    "\u0C07\u0C32\u0C3E \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F:",
    exampleQuestions: [
      "\u0C06\u0C26\u0C3F \u0C38\u0C2D \u0C30\u0C3E\u0C2A\u0C4D\u0C1A\u0C30\u0C4D\u0C32\u0C4B \u0C28\u0C2E\u0C4D\u0C2E\u0C3F\u0C02\u0C26\u0C3E?",
      "\u0C27\u0C30\u0C4D\u0C2E\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30\u0C02 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C41\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C2E\u0C27\u0C4D\u0C2F \u0C35\u0C4D\u0C2F\u0C24\u0C4D\u0C2F\u0C3E\u0C38\u0C02 \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F?"
    ],
    userGuide:       "\u2318 \u0C35\u0C3F\u0C28\u0C3F\u0C2F\u0C4B\u0C17\u0C26\u0C3E\u0C30\u0C41 \u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C26\u0C30\u0C4D\u0C36\u0C3F",
    tipBtn:          "\u2726 \u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C46\u0C38\u0C30\u0C4D\u0C15\u0C41 \u0C26\u0C47\u0C23\u0C02",
    saveBtn:         "\u2193 \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23 \u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C2F\u0C3F",
    installBtn:      "\u2B07 Android & Chrome \u0C35\u0C3E\u0C21\u0C47\u0C35\u0C3E\u0C30\u0C41 \u2014 \u0C39\u0C4B\u0C2E\u0C4D \u0C38\u0C4D\u0C15\u0C4D\u0C30\u0C40\u0C28\u0C4D\u0C15\u0C41 \u0C1C\u0C4B\u0C21\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
    newConvo:        "\u2295 \u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23",
    loading:         "\u0C2A\u0C4D\u0C30\u0C4B\u0C2B\u0C46\u0C38\u0C30\u0C4D \u0C32\u0C41\u0C2F\u0C3F\u0C38\u0C4D \u0C38\u0C2E\u0C3E\u0C27\u0C3E\u0C28\u0C02 \u0C30\u0C3E\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C30\u0C41\u2026",
    placeholder:     "\u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C46\u0C38\u0C30\u0C4D\u0C15\u0C41 \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F, \u0C32\u0C46\u0C15\u0C4D\u0C1A\u0C30\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F \u0C32\u0C47\u0C26\u0C3E \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37 \u0C2E\u0C4A\u0C26\u0C32\u0C41\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C02\u0C21\u0C3F\u2026",
    placeholderQuiz: "\u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 {n} / {total}\u0C15\u0C3F \u0C38\u0C2E\u0C3E\u0C27\u0C3E\u0C28\u0C02 \u0C07\u0C35\u0C4D\u0C35\u0C02\u0C21\u0C3F\u2026",
    placeholderSerm: "\u0C2E\u0C40 \u0C09\u0C2A\u0C26\u0C47\u0C36\u0C02 \u0C38\u0C3F\u0C26\u0C4D\u0C27\u0C02 \u0C15\u0C4A\u0C28\u0C38\u0C3E\u0C17\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F\u2026",
    footerQuote:     "\u201C\u0C38\u0C41\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C38\u0C32\u0C39\u0C3E \u0C15\u0C3E\u0C26\u0C41. \u0C07\u0C26\u0C3F \u0C12\u0C15 \u0C24\u0C40\u0C30\u0C4D\u0C2A\u0C41.\u201D \u2014 R.F. Capon",
    sermonBadge:     "\uD83C\uDFB5 \u0C09\u0C2A\u0C26\u0C47\u0C36\u0C02 \u0C38\u0C3F\u0C26\u0C4D\u0C27\u0C24",
    quickPrompts: [
      "\u0C35\u0C3E\u0C30\u0C02 1, \u0C32\u0C46\u0C15\u0C4D\u0C1A\u0C30\u0C4D 1 \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
      "\u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37 1 \u0C2E\u0C4A\u0C26\u0C32\u0C41\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C02\u0C21\u0C3F",
      "\u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37 2 \u0C2E\u0C4A\u0C26\u0C32\u0C41\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C02\u0C21\u0C3F",
      "\u0C2E\u0C27\u0C4D\u0C2F\u0C02\u0C24\u0C30 \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37 \u0C2E\u0C4A\u0C26\u0C32\u0C41\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C02\u0C21\u0C3F",
      "\u0C09\u0C2A\u0C26\u0C47\u0C36\u0C02 \u0C38\u0C3F\u0C26\u0C4D\u0C27\u0C02 \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
      "\u0C24\u0C4D\u0C38\u0C3F\u0C38\u0C4D \u0C05\u0C02\u0C36\u0C02 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C35\u0C21\u0C02\u0C32\u0C4B \u0C38\u0C39\u0C3E\u0C2F\u0C02 \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
      "\u0C05\u0C2E\u0C3F\u0C32\u0C47\u0C28\u0C3F\u0C2F\u0C32\u0C3F\u0C1C\u0C02 \u0C35\u0C3F\u0C35\u0C30\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
      "\u0C15\u0C43\u0C2A \u0C05\u0C02\u0C1F\u0C47 \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F?",
      "\u0C35\u0C28\u0C30\u0C41\u0C32\u0C41 \u0C38\u0C42\u0C1A\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F"
    ],
    welcome: "\u0C28\u0C2E\u0C38\u0C4D\u0C15\u0C3E\u0C30\u0C02. \u0C28\u0C47\u0C28\u0C41 Emerald City Seminary\u0C32\u0C4B Dr. J.R. Lewis\u0C28\u0C3F. \u0C28\u0C47\u0C28\u0C41 AI \u0C38\u0C46\u0C2E\u0C3F\u0C28\u0C30\u0C40 \u0C2A\u0C4D\u0C30\u0C4B\u0C2B\u0C46\u0C38\u0C30\u0C4D\u0C28\u0C3F. \u0C27\u0C30\u0C4D\u0C2E\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30\u0C02\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C02\u0C1A\u0C3F \u0C0F\u0C26\u0C48\u0C28\u0C3E \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F, \u0C32\u0C46\u0C15\u0C4D\u0C1A\u0C30\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C41\u0C2E\u0C28\u0C3F, \u0C09\u0C2A\u0C26\u0C47\u0C36\u0C02 \u0C38\u0C3F\u0C26\u0C4D\u0C27\u0C02 \u0C1A\u0C47\u0C2F\u0C41\u0C2E\u0C28\u0C3F \u0C15\u0C4B\u0C30\u0C02\u0C21\u0C3F.\n\n3-\u0C35\u0C3E\u0C30\u0C3E\u0C32 \u0C38\u0C46\u0C2E\u0C3F\u0C28\u0C30\u0C40 \u0C07\u0C02\u0C1F\u0C46\u0C28\u0C4D\u0C38\u0C3F\u0C35\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C2C\u0C4B\u0C26\u0C41\u0C35\u0C41. \u0C32\u0C3E \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C41\u0C35\u0C3E\u0C30\u0C4D\u0C24, \u0C26\u0C47\u0C35\u0C41\u0C28\u0C3F \u0C30\u0C3E\u0C1C\u0C4D\u0C2F\u0C02, \u0C0E\u0C38\u0C4D\u0C15\u0C3E\u0C1F\u0C3E\u0C32\u0C1C\u0C40, \u0C28\u0C4D\u0C2F\u0C42\u0C2E\u0C3E\u0C1F\u0C3E\u0C32\u0C1C\u0C40 \u0C05\u0C02\u0C36\u0C3E\u0C32\u0C41 \u0C1A\u0C47\u0C30\u0C4D\u0C1A\u0C41\u0C15\u0C41\u0C02\u0C1F\u0C3E\u0C2F\u0C3F.\n\n\u0C2E\u0C41\u0C02\u0C26\u0C41\u0C15\u0C41 \u0C38\u0C3E\u0C17\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C0F\u0C26\u0C48\u0C28\u0C3E \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
    langInstruction: "IMPORTANT: This student has selected Telugu as their language. Conduct this ENTIRE session in Telugu — all lectures, feedback, questions, quiz responses, and conversation. Use Telugu script throughout. Do not switch to English under any circumstances.",
    guide: {
      title: "\u0C35\u0C3F\u0C28\u0C3F\u0C2F\u0C4B\u0C17\u0C26\u0C3E\u0C30\u0C41 \u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C26\u0C30\u0C4D\u0C36\u0C3F",
      intro: "Emerald City Seminary\u0C15\u0C41 \u0C38\u0C4D\u0C35\u0C3E\u0C17\u0C24\u0C02. \u0C08 \u0C05\u0C2A\u0C4D\u0C32\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D \u0C1A\u0C47\u0C2F\u0C17\u0C32\u0C3F\u0C17\u0C47 \u0C05న్నిటి\u0C2A\u0C48 \u0C05\u0C28\u0C41\u0C15\u0C42\u0C32\u0C41\u0C02\u0C26\u0C41 \u0C38\u0C32\u0C39\u0C3E\u0C32\u0C41 \u0C15\u0C4D\u0C30\u0C3F\u0C02\u0C26 \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F. \u0C38\u0C02\u0C2A\u0C42\u0C30\u0C4D\u0C23 \u0C17\u0C48\u0C21\u0C4D \u0C15\u0C4A\u0C30\u0C15\u0C41 PDF \u0C21\u0C4C\u0C28\u0C4D\u0C32\u0C4B\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
      interfaceTitle: "\u0C07\u0C02\u0C1F\u0C30\u0C4D\u0C2B\u0C47\u0C38\u0C4D",
      items: [
        ["\uD83C\uDDFA\uD83C\uDDF8 English / \uD83C\uDDEA\uD83C\uDDF8 Espa\u00F1ol / \uD83C\uDDEE\uD83C\uDDF3 \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", "\u0C2D\u0C3E\u0C37\u0C3E \u0C2E\u0C3E\u0C30\u0C4D\u0C2A\u0C41 \u0C2C\u0C1F\u0C28\u0C4D\u0C32\u0C41. \u0C2E\u0C40 \u0C26\u0C47\u0C36\u0C02 \u0C27\u0C4D\u0C35\u0C1C\u0C02 \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C02\u0C21\u0C3F."],
        ["\u2318 \u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C26\u0C30\u0C4D\u0C36\u0C3F", "\u0C08 \u0C17\u0C48\u0C21\u0C4D \u0C24\u0C46\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F."],
        ["\u2726 \u0C2A\u0C4D\u0C30\u0C4B\u0C2B\u0C46\u0C38\u0C30\u0C4D\u0C15\u0C41 \u0C26\u0C47\u0C23\u0C02", "PayPal \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C26\u0C47\u0C23\u0C02. \u0C38\u0C42\u0C1A\u0C3F\u0C24 \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C3E\u0C32\u0C41: $5, $10, $25."],
        ["\u2193 \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23 \u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C2F\u0C3F", "\u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23\u0C28\u0C41 PDF\u0C17\u0C3E \u0C21\u0C4C\u0C28\u0C4D\u0C32\u0C4B\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F."],
        ["\u2B07 \u0C39\u0C4B\u0C2E\u0C4D \u0C38\u0C4D\u0C15\u0C4D\u0C30\u0C40\u0C28\u0C4D\u0C15\u0C41 \u0C1C\u0C4B\u0C21\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F", "Android \u0C32\u0C47\u0C26\u0C3E Chrome\u0C32\u0C4B \u0C07\u0C28\u0C4D\u0C38\u0C4D\u0C1F\u0C3E\u0C32\u0C4D."],
        ["\u2295 \u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23", "\u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23 \u0C24\u0C41\u0C21\u0C3F\u0C1A\u0C3F\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C3F \u0C30\u0C40\u0C38\u0C46\u0C1F\u0C4D. \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37 \u0C2E\u0C27\u0C4D\u0C2F\u0C32\u0C4B \u0C35\u0C41\u0C02\u0C1F\u0C47 \u0C39\u0C46\u0C1A\u0C4D\u0C1A\u0C30\u0C3F\u0C15 \u0C35\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F."],
        ["\uD83D\uDCCE \u0C2A\u0C47\u0C2A\u0C30\u0C4D\u0C15\u0C4D\u0C32\u0C3F\u0C2A\u0C4D", "PDF \u0C05\u0C2A\u0C4D\u0C32\u0C4B\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F."],
        ["\u2191 \u0C2A\u0C02\u0C2A\u0C3F\u0C02\u0C1A\u0C41", "\u0C38\u0C02\u0C26\u0C47\u0C36\u0C02 \u0C2A\u0C02\u0C2A\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F."],
        ["ECS", "Emerald City Seminary \u0C38\u0C02\u0C15\u0C4D\u0C37\u0C3F\u0C2A\u0C4D\u0C24\u0C02."]
      ],
      simpleTitle: "\u0C38\u0C41\u0C32\u0C2D\u0C2E\u0C48\u0C28 \u0C35\u0C3F\u0C28\u0C3F\u0C2F\u0C4B\u0C17\u0C3E\u0C32\u0C41",
      simpleItems: [
        ["\u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F", "\u0C0E\u0C26\u0C48\u0C28\u0C3E \u0C27\u0C30\u0C4D\u0C2E\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30 \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C38\u0C3F \u2191 \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C02\u0C21\u0C3F."],
        ["\u0C2E\u0C42\u0C32\u0C4D\u0C2F\u0C3E\u0C02\u0C15\u0C28\u0C02 \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C05\u0C02\u0C1F\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F", "\u0C38\u0C47\u0C35\u0C4D\u0C28\u0C41, \u0C35\u0C4D\u0C2F\u0C3E\u0C38\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C15\u0C3E\u0C2A\u0C40 \u0C1A\u0C47\u0C38\u0C3F \u0C07\u0C28\u0C4D\u0C2A\u0C41\u0C1F\u0C4D \u0C2B\u0C40\u0C32\u0C4D\u0C21\u0C4D\u0C32\u0C4B \u0C05\u0C02\u0C1F\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F."],
        ["PDF \u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37\u0C15\u0C41", "\uD83D\uDCCE \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C3F, PDF \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F, \u0C05\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41 \u0C2E\u0C40\u0C15\u0C41 \u0C0F\u0C2E\u0C3F \u0C15\u0C3E\u0C35\u0C3E\u0C32\u0C4B \u0C1A\u0C46\u0C2A\u0C4D\u0C2A\u0C02\u0C21\u0C3F."],
        ["PDF \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C2A\u0C3E\u0C20\u0C02 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F", "\uD83D\uDCCE \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C3F, PDF \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F, \u0C05\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C41: \u201C\u0C08 PDF \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C28\u0C47\u0C30\u0C4D\u0C2A\u0C02\u0C21\u0C3F\u201D \u0C05\u0C28\u0C02\u0C21\u0C3F."]
      ],
      courseTitle: "3-\u0C35\u0C3E\u0C30\u0C3E\u0C32 \u0C07\u0C02\u0C1F\u0C46\u0C28\u0C4D\u0C38\u0C3F\u0C35\u0C4D",
      courseItems: [
        ["\u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C21\u0C02 \u0C0E\u0C32\u0C3E", "\u0C35\u0C3E\u0C30\u0C02 1, \u0C32\u0C46\u0C15\u0C4D\u0C1A\u0C30\u0C4D 1 \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F \u0C05\u0C28\u0C3F \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F."],
        ["\u0C2A\u0C3E\u0C20\u0C4D\u0C2F\u0C2A\u0C4D\u0C30\u0C23\u0C3E\u0C33\u0C3F\u0C15", "12 \u0C32\u0C46\u0C15\u0C4D\u0C1A\u0C30\u0C4D\u0C32\u0C41, \u0C30\u0C46\u0C02\u0C21\u0C41 \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37\u0C32\u0C41, \u0C2E\u0C27\u0C4D\u0C2F\u0C02\u0C24\u0C30 \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37."],
        ["\u0C35\u0C47\u0C17\u0C02", "\u0C15\u0C4B\u0C30\u0C4D\u0C38\u0C4D \u0C2E\u0C40\u0C30\u0C41 \u0C1F\u0C48\u0C2A\u0C4D \u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28 \u0C35\u0C47\u0C17\u0C02\u0C24\u0C4B \u0C38\u0C3E\u0C17\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F."],
        ["\u0C2A\u0C4D\u0C30\u0C17\u0C24\u0C3F \u0C15\u0C4B\u0C32\u0C4D\u0C2A\u0C4B\u0C35\u0C21\u0C02", "\u0C38\u0C02\u0C2D\u0C3E\u0C37\u0C23 \u0C24\u0C4A\u0C32\u0C17\u0C3F\u0C38\u0C4D\u0C24\u0C47 \u0C2A\u0C4D\u0C30\u0C17\u0C24\u0C3F \u0C15\u0C4B\u0C32\u0C4D\u0C2A\u0C4B\u0C24\u0C41\u0C02\u0C26\u0C3F. \u2193 \u0C38\u0C47\u0C35\u0C4D \u0C06\u0C2A\u0C4D\u0C37\u0C28\u0C4D \u0C35\u0C3E\u0C21\u0C02\u0C21\u0C3F."],
        ["\u0C2A\u0C4D\u0C30\u0C17\u0C24\u0C3F \u0C24\u0C3F\u0C30\u0C3F\u0C17\u0C3F \u0C2A\u0C4A\u0C02\u0C26\u0C21\u0C02", "\u0C2E\u0C40\u0C30\u0C41 \u0C0E\u0C15\u0C4D\u0C15\u0C21 \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C30\u0C4B \u0C2A\u0C4D\u0C30\u0C4B\u0C2B\u0C46\u0C38\u0C30\u0C4D\u0C15\u0C41 \u0C1A\u0C46\u0C2A\u0C4D\u0C2A\u0C02\u0C21\u0C3F."]
      ],
      installTitle: "\u0C05\u0C2A\u0C4D \u0C07\u0C28\u0C4D\u0C38\u0C4D\u0C1F\u0C3E\u0C32\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
      installItems: [
        ["iPhone / iPad", "Safari\u0C32\u0C4B \u0C24\u0C46\u0C30\u0C35\u0C02\u0C21\u0C3F \u2192 Share \u2197 \u2192 Add to Home Screen \u2192 Add."],
        ["Android", "Chrome\u0C32\u0C4B \u0C24\u0C46\u0C30\u0C35\u0C02\u0C21\u0C3F \u2192 \u0C39\u0C46\u0C21\u0C30\u0C4D\u0C32\u0C4B Add to Home Screen \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C02\u0C21\u0C3F."],
        ["Windows / Mac", "Chrome \u0C32\u0C47\u0C26\u0C3E Edge\u0C32\u0C4B \u0C24\u0C46\u0C30\u0C35\u0C02\u0C21\u0C3F \u2192 \u0C07\u0C28\u0C4D\u0C38\u0C4D\u0C1F\u0C3E\u0C32\u0C4D \u0C05\u0C2F\u0C4D\u0C15\u0C3E\u0C28\u0C4D \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C02\u0C21\u0C3F."]
      ],
      downloadBtn: "\u2193 \u0C38\u0C02\u0C2A\u0C42\u0C30\u0C4D\u0C23 \u0C17\u0C48\u0C21\u0C4D \u0C21\u0C4C\u0C28\u0C4D\u0C32\u0C4B\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F (PDF)",
      closeBtn: "\u0C2E\u0C42\u0C38\u0C3F\u0C35\u0C47\u0C2F\u0C02\u0C21\u0C3F",
      pdfPath: "/ECS-User-Guide-te.pdf"
    }
  }
};



var STORAGE_KEY = "ecs_conversation_v1";

function loadConversation(welcomeMsg) {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [welcomeMsg];
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [welcomeMsg];
    return parsed;
  } catch (e) {
    return [welcomeMsg];
  }
}

function saveConversation(msgs) {
  try {
    var toSave = msgs.slice(-60);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {}
}

function clearConversation() {
  try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

export default function App() {
  var [lang, setLang] = useState(function() {
    try { return localStorage.getItem("ecs_lang") || "en"; } catch(e) { return "en"; }
  });

  var L = TRANSLATIONS[lang] || TRANSLATIONS.en;

  var WELCOME = L.welcome;
  var welcomeMsg = { role: "assistant", content: WELCOME };
  var [messages, setMessages] = useState(function() { return loadConversation(welcomeMsg); });
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var [uploadedPDF, setUploadedPDF] = useState(null);
  var [quizState, setQuizState] = useState(null);
  var [sermonMode, setSermonMode] = useState(false);
  var [installPrompt, setInstallPrompt] = useState(null);
  var [tipOpen, setTipOpen] = useState(false);
  var [guideOpen, setGuideOpen] = useState(false);
  var [aboutOpen, setAboutOpen] = useState(false);
  var messagesEndRef = useRef(null);
  var fileInputRef = useRef(null);
  var inputRef = useRef(null);

  // Android keyboard fix — scroll input into view when keyboard opens
  useEffect(function() {
    var handleResize = function() {
      if (inputRef.current && document.activeElement === inputRef.current) {
        setTimeout(function() {
          inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    };
    window.addEventListener("resize", handleResize);
    return function() { window.removeEventListener("resize", handleResize); };
  }, []);

  useEffect(function() { saveConversation(messages); }, [messages]);

  // Initialize PostHog
  useEffect(function() { initPostHog(); }, []);

  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Android/Chrome install prompt
  useEffect(function() {
    var handler = function(e) {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return function() { window.removeEventListener("beforeinstallprompt", handler); };
  }, []);

  function handleLangChange(newLang) {
    try { localStorage.setItem("ecs_lang", newLang); } catch(e) {}
    setLang(newLang);
    clearConversation();
    var newL = TRANSLATIONS[newLang] || TRANSLATIONS.en;
    setMessages([{ role: "assistant", content: newL.welcome }]);
    setQuizState(null);
    setSermonMode(false);
    setUploadedPDF(null);
    setInput("");
    track("changed_language", { language: newLang });
  }

  function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(function() {
      setInstallPrompt(null);
    });
  }

  var [confirmClear, setConfirmClear] = useState(false);

  function getSessionContext() {
    if (quizState) return "You are currently on Question " + (quizState.currentQ + 1) + " of " + quizState.quiz.questions.length + " in " + quizState.quiz.title + ".";
    if (sermonMode) return "You are currently in the middle of a Sermon Preparation session.";
    if (messages.length > 4) return "You have an active conversation with Theologian Lewis in progress.";
    return null;
  }

  function handleNewConversation() {
    var context = getSessionContext();
    if (context) {
      setConfirmClear(true);
    } else {
      clearConversation();
      setMessages([{ role: "assistant", content: WELCOME }]);
      setQuizState(null);
      setSermonMode(false);
      setUploadedPDF(null);
      setInput("");
    }
  }

  function confirmNewConversation() {
    track("started_new_conversation");
    clearConversation();
    setMessages([{ role: "assistant", content: WELCOME }]);
    setQuizState(null);
    setSermonMode(false);
    setUploadedPDF(null);
    setInput("");
    setConfirmClear(false);
  }

  function startQuiz(quizData) {
    setQuizState({ quiz: quizData, currentQ: 0, answers: [] });
    return "**" + quizData.title + "**\n\nThis quiz has 10 questions. I will present them one at a time and give you feedback after each answer.\n\nQuestion 1:\n\n" + quizData.questions[0].q;
  }

  function advanceQuiz(userAnswer) {
    var quiz = quizState.quiz;
    var currentQ = quizState.currentQ;
    var modelAnswer = quiz.questions[currentQ].answer;
    var nextQ = currentQ + 1;
    var isLast = nextQ >= quiz.questions.length;
    if (!isLast) {
      setQuizState({ quiz: quiz, currentQ: nextQ, answers: quizState.answers.concat([userAnswer]) });
    } else {
      track("completed_quiz", { quiz: quiz.title });
      setQuizState(null);
    }
    return { isLast: isLast, modelAnswer: modelAnswer, nextQuestion: isLast ? null : quiz.questions[nextQ].q, nextQNum: nextQ + 1, quizTitle: quiz.title };
  }

  async function sendToAPI(msgs, pdfBase64, pdfName) {
    setLoading(true);
    try {
      var langNote = L.langInstruction ? L.langInstruction + "\n\n" : "";
      var apiMessages = msgs.map(function(m, i) {
        if (pdfBase64 && m.role === "user" && i === msgs.length - 1) {
          return { role: "user", content: [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } }, { type: "text", text: m.content }] };
        }
        return { role: m.role, content: m.content };
      });
      var resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: langNote + buildSystemPrompt(pdfName || null), messages: apiMessages })
      });
      if (!resp.ok) { var e = await resp.json().catch(function() { return {}; }); throw new Error(e.error || "HTTP " + resp.status); }
      var data = await resp.json();
      var text = data.content.filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("\n");
      setMessages(function(prev) { return prev.concat([{ role: "assistant", content: text }]); });
    } catch (err) {
      setMessages(function(prev) { return prev.concat([{ role: "assistant", content: "Connection error: " + err.message }]); });
    } finally {
      setLoading(false);
    }
  }

  async function sendToAPIWithInstruction(msgs, instruction) {
    setLoading(true);
    try {
      var langNote = L.langInstruction ? L.langInstruction + "\n\n" : "";
      var apiMessages = msgs.map(function(m) { return { role: m.role, content: m.content }; }).concat([{ role: "user", content: instruction }]);
      var resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: langNote + buildSystemPrompt(uploadedPDF ? uploadedPDF.name : null), messages: apiMessages })
      });
      if (!resp.ok) { throw new Error("HTTP " + resp.status); }
      var data = await resp.json();
      var text = data.content.filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("\n");
      setMessages(function(prev) { return prev.concat([{ role: "assistant", content: text }]); });
    } catch (err) {
      setMessages(function(prev) { return prev.concat([{ role: "assistant", content: "Connection error: " + err.message }]); });
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    var base64 = await new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() { resolve(reader.result.split(",")[1]); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setUploadedPDF({ name: file.name, base64: base64 });
    track("uploaded_pdf", { filename: file.name });
    var msg = "I have uploaded a PDF reading: \"" + file.name + "\". Please acknowledge it and ask what I would like to do.";
    var newMsgs = messages.concat([{ role: "user", content: msg }]);
    setMessages(newMsgs);
    await sendToAPI(newMsgs, base64, file.name);
    e.target.value = "";
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    var userText = input.trim();
    setInput("");
    var lower = userText.toLowerCase();

    if (lower.indexOf("start quiz 1") !== -1 || lower === "quiz 1") {
      var i1 = startQuiz(QUIZ_1);
      track("started_quiz", { quiz: "Quiz 1" });
      setMessages(function(prev) { return prev.concat([{ role: "user", content: userText }, { role: "assistant", content: i1 }]); });
      return;
    }
    if (lower.indexOf("start quiz 2") !== -1 || lower === "quiz 2") {
      var i2 = startQuiz(QUIZ_2);
      track("started_quiz", { quiz: "Quiz 2" });
      setMessages(function(prev) { return prev.concat([{ role: "user", content: userText }, { role: "assistant", content: i2 }]); });
      return;
    }
    if (lower.indexOf("start midterm") !== -1 || lower === "midterm") {
      setQuizState({ quiz: MIDTERM, currentQ: 0, answers: [] });
      track("started_quiz", { quiz: "Midterm" });
      var mi = "**" + MIDTERM.title + "**\n\nThree essay questions, 100 points total. Write each essay in full — I will give detailed feedback before presenting the next.\n\nEssay Question 1 (30 points):\n\n" + MIDTERM.questions[0].q;
      setMessages(function(prev) { return prev.concat([{ role: "user", content: userText }, { role: "assistant", content: mi }]); });
      return;
    }
    if (lower.indexOf("sermon prep") !== -1 || lower.indexOf("prepare a sermon") !== -1 || lower.indexOf("start sermon") !== -1) {
      setSermonMode(true);
      track("started_sermon_prep");
      var si = "**Sermon Preparation Module**\n\nExcellent. There is no more important work than preparing to preach the Word. We will work through this together in 10 steps.\n\nBefore we begin — tell me: what is your text? Give me the Scripture reference and I will walk alongside you from there.";
      setMessages(function(prev) { return prev.concat([{ role: "user", content: userText }, { role: "assistant", content: si }]); });
      return;
    }
    if (lower.indexOf("thesis") !== -1 || lower.indexOf("doctoral") !== -1) {
      track("started_doctoral_thesis");
    }
    if (lower.indexOf("begin week 1") !== -1 || lower.indexOf("lecture 1") !== -1) {
      track("started_week1_lecture1");
    }

    if (quizState) {
      var result = advanceQuiz(userText);
      var qMsgs = messages.concat([{ role: "user", content: userText }]);
      setMessages(qMsgs);
      var instruction;
      if (result.isLast) {
        instruction = "[GRADING INSTRUCTION — do not show this to the student]\nFinal question of " + result.quizTitle + ". Student answer: \"" + userText + "\". Model answer: \"" + result.modelAnswer + "\". Grade it and give warm overall assessment.";
      } else {
        instruction = "[GRADING INSTRUCTION — do not show this to the student]\nStudent answered: \"" + userText + "\". Model answer: \"" + result.modelAnswer + "\". Give 2-4 sentences of feedback, then present Question " + result.nextQNum + ": \"" + result.nextQuestion + "\"";
      }
      await sendToAPIWithInstruction(qMsgs, instruction);
      return;
    }

    var newMsgs = messages.concat([{ role: "user", content: userText }]);
    setMessages(newMsgs);
    track("sent_message", { message_count: newMsgs.filter(function(m) { return m.role === "user"; }).length });
    await sendToAPI(newMsgs, uploadedPDF ? uploadedPDF.base64 : null, uploadedPDF ? uploadedPDF.name : null);
  }

  function handleKeyDown(e) {
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (e.key === "Enter" && !e.shiftKey && !isMobile) { e.preventDefault(); handleSend(); }
  }

  function formatText(text) {
    return text.split("\n").map(function(line, i) {
      var linkParts = line.split(/(https?:\/\/[^\s]+)/g);
      var parts = linkParts.map(function(part, j) {
        if (part.match(/^https?:\/\//)) {
          return React.createElement("a", { key: j, href: part, target: "_blank", rel: "noopener noreferrer", style: { color: "#7a5a10", textDecoration: "underline" } }, part);
        }
        return part.split(/(\*\*[^*]+\*\*)/g).map(function(bp, k) {
          if (bp.indexOf("**") === 0 && bp.lastIndexOf("**") === bp.length - 2) {
            return React.createElement("strong", { key: k }, bp.slice(2, -2));
          }
          return bp;
        });
      });
      return React.createElement("span", { key: i }, parts, i < text.split("\n").length - 1 ? React.createElement("br") : null);
    });
  }

  function guideItem(label, desc) {
    return React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" } },
      React.createElement("div", { style: { fontFamily: fontSerif, fontSize: 14, fontWeight: 600, color: "#1a4a32", minWidth: 140, flexShrink: 0, paddingTop: 1 } }, label),
      React.createElement("div", { style: { fontFamily: fontSerif, fontSize: 14, lineHeight: 1.7, color: T.ink, fontWeight: 300 } }, desc)
    );
  }

  function spacerDiv() {
    return React.createElement("div", { style: { height: 16 } });
  }

  var quickPrompts = L.quickPrompts;

  // ── Ivory & Ink theme tokens ──
  var T = {
    pageBg:       "#f5f0e8",
    headerBg:     "#ede8dc",
    headerBorder: "#1a4a32",   // dark emerald
    headerBorder2: "#c4a030",
    ink:          "#1a1610",
    inkMuted:     "#2a5a3a",   // dark green
    inkFaint:     "#4a7a58",   // medium green
    gold:         "#9a7a1a",
    goldLight:    "#c4a030",
    rule:         "#c0d0c4",   // greenish rule
    // bubbles
    profBg:       "#e8e4de",
    profBorder:   "#c8c0b0",
    profText:     "#1a1610",
    profAccent:   "#1a4a32",   // dark emerald accent bar
    studBg:       "#1a3a28",   // dark green
    studBorder:   "#2a5a3c",
    studText:     "#c8dcd0",
    // input area
    inputAreaBg:  "#ede8dc",
    inputBg:      "#f5f0e8",
    inputBorder:  "#1a4a32",   // dark emerald
    sendBg:       "#1a4a32",   // dark emerald send button
    sendColor:    "#f0f8f4",
    // quick prompts
    qBtnBorder:   "#c0d0c4",
    qBtnColor:    "#2a5a3a",   // dark green
    // monogram ring
    monoRing:     "#c4a030",
  };

  var fontSerif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  var fontSC    = "'Cormorant SC', Georgia, serif";
  var fontSans  = "'Lato', Arial, sans-serif";

  return React.createElement("div", { style: { minHeight: "100vh", background: T.pageBg, display: "flex", flexDirection: "column", fontFamily: fontSerif, color: T.ink } },

    // ── HEADER ──
    React.createElement("div", { style: { background: T.headerBg, borderBottom: "2px solid " + T.headerBorder, padding: "16px 32px", display: "flex", alignItems: "center", gap: 18, flexShrink: 0, flexWrap: "wrap", position: "relative" } },

      // Gold rule under header border
      React.createElement("div", { style: { position: "absolute", bottom: -5, left: 32, right: 32, height: 1, background: T.goldLight } }),

      // Monogram circle
      React.createElement("div", { style: { width: 52, height: 52, borderRadius: "50%", border: "2px solid #1a4a32", background: T.headerBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" } },
        React.createElement("div", { style: { position: "absolute", inset: 3, borderRadius: "50%", border: "1px solid " + T.monoRing } }),
        React.createElement("span", { style: { fontFamily: fontSC, fontSize: 14, fontWeight: 600, color: "#1a4a32", letterSpacing: "-0.5px", position: "relative", zIndex: 1 } }, "ECS")
      ),

      // Name & subtitle
      React.createElement("div", null,
        React.createElement("div", { style: { fontFamily: fontSC, fontSize: 22, fontWeight: 600, color: "#1a4a32", letterSpacing: "0.06em" } }, L.seminary),
        React.createElement("div", { style: { fontFamily: fontSerif, fontSize: 13, color: T.inkMuted, fontStyle: "italic", fontWeight: 300, marginTop: 3 } }, L.subheading)
      ),

      // Language selector — three flag buttons in native script
      React.createElement("div", { style: { display: "flex", gap: 4 } },
        [
          { code: "en", flag: "\uD83C\uDDFA\uD83C\uDDF8", label: "English" },
          { code: "es", flag: "\uD83C\uDDEA\uD83C\uDDF8", label: "Espa\u00F1ol" },
          { code: "te", flag: "\uD83C\uDDEE\uD83C\uDDF3", label: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41" }
        ].map(function(l) {
          var active = lang === l.code;
          return React.createElement("button", {
            key: l.code,
            onClick: function() { handleLangChange(l.code); },
            title: l.label,
            style: {
              padding: "5px 10px",
              background: active ? "#1a4a32" : "#ede8dc",
              border: "1px solid #1a4a32",
              borderRadius: 4,
              color: active ? "#f0f8f4" : "#1a4a32",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "sans-serif",
              fontWeight: active ? 700 : 400,
              flexShrink: 0,
              lineHeight: 1.4,
              whiteSpace: "nowrap"
            }
          }, l.flag + " " + l.label);
        })
      ),

      // PDF badge
      uploadedPDF
        ? React.createElement("div", { style: { marginLeft: "auto", background: "#e8f0e8", border: "1px solid #a0c0a0", borderRadius: 4, padding: "5px 12px", fontSize: 12, color: "#3a6a3a", display: "flex", alignItems: "center", gap: 6 } },
            React.createElement("span", null, "\uD83D\uDCC4"),
            React.createElement("span", { style: { maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, uploadedPDF.name),
            React.createElement("button", { onClick: function() { setUploadedPDF(null); }, style: { background: "none", border: "none", color: "#5a8a5a", cursor: "pointer", fontSize: 15, padding: 0, marginLeft: 4 } }, "\u00D7")
          )
        : null,

      // Quiz badge
      quizState ? React.createElement("div", { style: { background: "#f8f0d8", border: "1px solid " + T.goldLight, borderRadius: 4, padding: "5px 12px", fontSize: 11, color: T.gold, fontFamily: fontSerif, fontStyle: "italic" } }, quizState.quiz.title + " \u2014 Q" + (quizState.currentQ + 1) + "/" + quizState.quiz.questions.length) : null,

      // Sermon badge
      sermonMode ? React.createElement("div", { style: { background: "#e8f0e8", border: "1px solid #a0c0a0", borderRadius: 4, padding: "5px 12px", fontSize: 11, color: "#3a6a3a", fontFamily: fontSerif, fontStyle: "italic" } }, L.sermonBadge) : null,

      // About button
      React.createElement("button", {
        onClick: function() { track("opened_about_modal"); setAboutOpen(true); },
        style: { padding: "6px 14px", background: "#e8ece8", border: "1px solid #1a4a32", borderRadius: 4, color: "#1a4a32", fontSize: 11, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic", flexShrink: 0, whiteSpace: "nowrap" }
      }, "\u24D8 About"),

      // User Guide button
      React.createElement("button", {
        onClick: function() { track("opened_user_guide"); setGuideOpen(true); },
        style: { padding: "6px 14px", background: "#e8ece8", border: "1px solid #1a4a32", borderRadius: 4, color: "#1a4a32", fontSize: 11, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic", flexShrink: 0, whiteSpace: "nowrap" }
      }, L.userGuide),

      // Tip button
      React.createElement("button", {
        onClick: function() { track("opened_tip_modal"); setTipOpen(true); },
        style: { padding: "6px 14px", background: "#fffbe8", border: "1px solid " + T.goldLight, borderRadius: 4, color: T.gold, fontSize: 11, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic", flexShrink: 0, whiteSpace: "nowrap", fontWeight: 600 }
      }, L.tipBtn),

      // Download conversation
      messages.length > 1 ? React.createElement("button", {
        onClick: function() { track("downloaded_conversation_pdf"); downloadConversationPDF(messages); },
        title: "Download conversation as PDF",
        style: { padding: "6px 14px", background: "#e8ece8", border: "1px solid #1a4a32", borderRadius: 4, color: "#1a4a32", fontSize: 11, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic", flexShrink: 0, whiteSpace: "nowrap" }
      }, L.saveBtn) : null,

      // Install button
      installPrompt ? React.createElement("button", {
        onClick: handleInstall,
        style: { padding: "6px 14px", background: "#e8f0f8", border: "1px solid #8ab0d0", borderRadius: 4, color: "#2a5a8a", fontSize: 11, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic", flexShrink: 0, whiteSpace: "nowrap" }
      }, L.installBtn) : null,

      // New Conversation
      React.createElement("button", {
        onClick: handleNewConversation,
        style: { padding: "6px 14px", background: "#e8f0e8", border: "1px solid #3a6a3a", borderRadius: 4, color: "#3a6a3a", fontSize: 11, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic", flexShrink: 0, whiteSpace: "nowrap" }
      }, L.newConvo)
    ),

    // ── ORIENTATION BAR ──
    React.createElement("div", { style: { background: "#1a4a32", padding: "10px 32px", textAlign: "center", flexShrink: 0 } },
      React.createElement("div", { style: { fontFamily: fontSerif, fontSize: 13, color: "#9fbfae", fontStyle: "italic", letterSpacing: "0.03em", maxWidth: 860, margin: "0 auto" } }, L.orientationLine)
    ),

    // ── MESSAGES ──
    React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "36px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 860, margin: "0 auto", width: "100%" } },
      messages.map(function(msg, i) {
        var isAssistant = msg.role === "assistant";
        return React.createElement("div", { key: i, style: { display: "flex", flexDirection: isAssistant ? "row" : "row-reverse", gap: 14, alignItems: "flex-start" } },

          // Avatar
          isAssistant
            ? React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", border: "1.5px solid " + T.ink, background: T.headerBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSC, fontSize: 12, fontWeight: 600, color: T.ink, flexShrink: 0, marginTop: 4, position: "relative" } },
                React.createElement("div", { style: { position: "absolute", inset: 2, borderRadius: "50%", border: "1px solid " + T.monoRing } }),
                React.createElement("span", { style: { position: "relative", zIndex: 1 } }, "ECS")
              )
            : null,

          // Bubble
          React.createElement("div", { style: {
            maxWidth: "78%",
            padding: "18px 22px",
            fontSize: 17,
            lineHeight: 1.9,
            borderRadius: 4,
            background: isAssistant ? T.profBg : T.studBg,
            border: isAssistant ? ("1px solid " + T.profBorder) : ("1px solid " + T.studBorder),
            borderLeft: isAssistant ? ("3px solid " + T.profAccent) : undefined,
            borderRight: isAssistant ? undefined : ("3px solid #666"),
            color: isAssistant ? T.profText : T.studText,
            fontWeight: 300,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
          } }, formatText(msg.content))
        );
      }),

      // ── TRUST STATEMENT — shown below first welcome message only ──
      messages.length === 1 ? React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "flex-start" } },
        React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", border: "1.5px solid " + T.ink, background: T.headerBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSC, fontSize: 12, fontWeight: 600, color: T.ink, flexShrink: 0, marginTop: 4, position: "relative" } },
          React.createElement("div", { style: { position: "absolute", inset: 2, borderRadius: "50%", border: "1px solid " + T.monoRing } }),
          React.createElement("span", { style: { position: "relative", zIndex: 1 } }, "ECS")
        ),
        React.createElement("div", { style: { maxWidth: "78%", padding: "18px 22px", fontSize: 15, lineHeight: 1.9, borderRadius: 4, background: T.profBg, border: "1px solid " + T.profBorder, borderLeft: "3px solid " + T.profAccent, color: T.profText, fontWeight: 300, fontStyle: "italic", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" } },
          React.createElement("div", { style: { fontFamily: fontSC, fontSize: 11, letterSpacing: "0.15em", color: T.inkFaint, marginBottom: 8, textTransform: "uppercase", fontStyle: "normal" } }, L.trustLabel),
          React.createElement("p", { style: { marginBottom: 10 } }, L.trustLine1),
          React.createElement("p", { style: { marginBottom: 10 } }, L.trustLine2),
          React.createElement("p", { style: { marginBottom: 0 } }, L.trustLine3)
        )
      ) : null,

      // Loading indicator
      loading ? React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
        React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", border: "1.5px solid " + T.ink, background: T.headerBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSC, fontSize: 12, color: T.ink, flexShrink: 0 } }, "JL"),
        React.createElement("div", { style: { padding: "14px 20px", background: T.profBg, border: "1px solid " + T.profBorder, borderLeft: "3px solid " + T.profAccent, borderRadius: 4, color: T.inkMuted, fontSize: 15, fontStyle: "italic" } }, L.loading)
      ) : null,

      React.createElement("div", { ref: messagesEndRef })
    ),

    // ── QUIZ HOOK + EXAMPLE QUESTIONS (shown when conversation is fresh) ──
    messages.length < 3 ? React.createElement("div", { style: { padding: "0 32px 0", maxWidth: 860, margin: "0 auto", width: "100%" } },

      // 3-Week Intensive featured button
      React.createElement("div", { style: { borderTop: "1px solid " + T.rule, paddingTop: 16, marginBottom: 14 } },
        React.createElement("button", {
          onClick: function() { setInput("Begin Week 1, Lecture 1"); },
          style: {
            width: "100%", padding: "16px 24px",
            background: "#1a4a32", border: "none", borderRadius: 4,
            cursor: "pointer", textAlign: "left", position: "relative"
          }
        },
          React.createElement("div", { style: { position: "absolute", top: 0, left: 24, right: 24, height: 1, background: "rgba(196,160,48,0.5)" } }),
          React.createElement("div", { style: { fontFamily: fontSC, fontSize: 15, fontWeight: 600, color: "#f0f8f4", letterSpacing: "0.06em", marginBottom: 4 } }, L.intensiveBtn),
          React.createElement("div", { style: { fontFamily: fontSerif, fontSize: 13, color: "#9fbfae", fontStyle: "italic" } }, L.intensiveSub),
          React.createElement("div", { style: { position: "absolute", top: "50%", right: 20, transform: "translateY(-50%)", color: "#c4a030", fontSize: 18, lineHeight: 1 } }, "\u2192")
        )
      ),

      // Quiz hook
      React.createElement("div", { style: { borderTop: "1px solid " + T.rule, paddingTop: 16, marginBottom: 14 } },
        React.createElement("div", { style: { fontFamily: fontSC, fontSize: 13, fontWeight: 600, color: "#1a4a32", letterSpacing: "0.1em", marginBottom: 3 } }, L.quizHook),
        React.createElement("div", { style: { fontFamily: fontSerif, fontSize: 13, color: T.inkMuted, fontStyle: "italic", marginBottom: 10 } }, L.quizHookSub),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
          L.quizButtons.map(function(btn, i) {
            return React.createElement("button", {
              key: i,
              onClick: function() { setInput(btn.cmd); },
              style: { padding: "5px 14px", background: "#f8f0d8", border: "1px solid " + T.goldLight, borderRadius: 20, color: T.gold, fontSize: 13, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic", fontWeight: 600 }
            }, btn.label);
          })
        )
      ),

      // Example questions
      React.createElement("div", { style: { borderTop: "1px solid " + T.rule, paddingTop: 14, paddingBottom: 16 } },
        React.createElement("div", { style: { fontFamily: fontSC, fontSize: 11, fontWeight: 600, color: T.inkFaint, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" } }, L.exampleLabel),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
          L.exampleQuestions.map(function(q, i) {
            return React.createElement("button", {
              key: i,
              onClick: function() { setInput(q); },
              style: { padding: "5px 14px", background: "transparent", border: "1px solid " + T.qBtnBorder, borderRadius: 20, color: T.qBtnColor, fontSize: 13, cursor: "pointer", fontFamily: fontSerif, fontStyle: "italic" }
            }, q);
          })
        )
      )

    ) : null,

    // ── INPUT AREA ──
    React.createElement("div", { style: { borderTop: "2px solid " + T.headerBorder, padding: "18px 32px 22px", background: T.inputAreaBg, flexShrink: 0, position: "relative" } },
      React.createElement("div", { style: { position: "absolute", top: -4, left: 32, right: 32, height: 1, background: T.goldLight } }),
      React.createElement("div", { style: { maxWidth: 860, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" } },
        React.createElement("button", {
          onClick: function() { if (fileInputRef.current) fileInputRef.current.click(); },
          title: "Upload a required reading PDF",
          style: { width: 46, height: 46, background: "transparent", border: "1.5px solid " + T.inputBorder, borderRadius: 4, color: T.inkMuted, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }
        }, "\uD83D\uDCCE"),
        React.createElement("input", { ref: fileInputRef, type: "file", accept: "application/pdf", style: { display: "none" }, onChange: handleFileUpload }),
        React.createElement("textarea", {
          ref: inputRef,
          value: input,
          onChange: function(e) { setInput(e.target.value); },
          onKeyDown: handleKeyDown,
          onFocus: function() { setTimeout(function() { if (inputRef.current) inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" }); }, 150); },
          placeholder: quizState ? L.placeholderQuiz.replace("{n}", quizState.currentQ + 1).replace("{total}", quizState.quiz.questions.length) : sermonMode ? L.placeholderSerm : L.placeholder,
          rows: 1,
          style: { flex: 1, background: T.inputBg, border: "1.5px solid " + T.inputBorder, borderRadius: 4, padding: "12px 16px", color: T.ink, fontSize: 16, fontFamily: fontSerif, resize: "none", outline: "none", lineHeight: 1.5, minHeight: 46, maxHeight: 140, overflowY: "auto" },
          onInput: function(e) { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px"; }
        }),
        React.createElement("button", {
          onClick: handleSend,
          disabled: loading || !input.trim(),
          style: { padding: "12px 20px", height: 46, background: (loading || !input.trim()) ? T.rule : T.sendBg, border: "none", borderRadius: 4, color: (loading || !input.trim()) ? T.inkFaint : T.sendColor, fontSize: 16, cursor: (loading || !input.trim()) ? "not-allowed" : "pointer", fontWeight: "bold", flexShrink: 0 }
        }, "\u2191")
      ),
      React.createElement("div", { style: { textAlign: "center", fontSize: 12, color: T.inkFaint, marginTop: 10, fontStyle: "italic", fontFamily: fontSerif } }, L.footerQuote),
      React.createElement("div", { style: { textAlign: "center", fontSize: 10, color: T.inkFaint, marginTop: 5, fontStyle: "italic", fontFamily: fontSerif } }, "\u00A9 2025 Ellery Aguayo. Emerald City Seminary is a ministry of Emerald City Sanctuary.")
    )
    ,
    // ── ABOUT MODAL ──
    aboutOpen ? React.createElement("div", {
      onClick: function(e) { if (e.target === e.currentTarget) setAboutOpen(false); },
      style: { position: "fixed", inset: 0, background: "rgba(26,74,50,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }
    },
      React.createElement("div", { style: { background: "#f5f0e8", border: "2px solid #1a4a32", borderRadius: 6, maxWidth: 520, width: "100%", maxHeight: "88vh", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", fontFamily: fontSerif } },

        React.createElement("div", { style: { position: "absolute", top: -1, left: 40, right: 40, height: 2, background: "#c4a030" } }),

        React.createElement("div", { style: { background: "#1a4a32", borderRadius: "4px 4px 0 0", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 } },
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily: fontSC, fontSize: 17, fontWeight: 600, color: "#f0f8f4", letterSpacing: "0.06em" } }, "Emerald City Seminary"),
            React.createElement("div", { style: { fontFamily: fontSans, fontSize: 10, color: "#7aaa88", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 } }, "About this app")
          ),
          React.createElement("button", { onClick: function() { setAboutOpen(false); }, style: { background: "none", border: "none", color: "#7aaa88", fontSize: 20, cursor: "pointer", lineHeight: 1 } }, "\u00D7")
        ),

        React.createElement("div", { style: { height: 2, background: "#c4a030", flexShrink: 0 } }),

        React.createElement("div", { style: { overflowY: "auto", padding: "24px 28px", flex: 1 } },

          [
            ["Purpose", "Emerald City Seminary is an educational tool designed to help users explore Christian theology and biblical concepts."],
            ["Educational use only", "Content is provided for informational and educational purposes only and should not be considered official doctrinal teaching, pastoral counseling, or authoritative theological guidance."],
            ["Accuracy", "While we strive for accuracy, responses may be incomplete or contain errors. Users are encouraged to consult Scripture, qualified clergy, or trusted theological sources for guidance on matters of faith and practice."],
            ["About Theologian Lewis", "Theologian Lewis is a fictional guide and does not represent a real person, church, or denomination. This app uses artificial intelligence to generate responses, which may not always reflect precise theological positions or denominational standards."],
            ["Discretion", "Use of this app is at your own discretion."],
          ].map(function(item, i) {
            return React.createElement("div", { key: i, style: { marginBottom: 16 } },
              React.createElement("div", { style: { fontFamily: fontSC, fontSize: 12, fontWeight: 600, color: "#1a4a32", letterSpacing: "0.08em", marginBottom: 4 } }, item[0].toUpperCase()),
              React.createElement("div", { style: { fontSize: 14, lineHeight: 1.85, color: "#1a1610", fontWeight: 300 } }, item[1])
            );
          }),

          React.createElement("div", { style: { height: 1, background: "#c0d0c4", margin: "16px 0 12px" } }),
          React.createElement("div", { style: { fontSize: 12, color: "#4a7a58", fontStyle: "italic", textAlign: "center", fontFamily: fontSerif } }, "\u00A9 2025 Ellery Aguayo. Emerald City Seminary is a ministry of Emerald City Sanctuary.")
        ),

        React.createElement("div", { style: { borderTop: "1px solid #c0d0c4", padding: "14px 24px", background: "#ede8dc", borderRadius: "0 0 4px 4px", flexShrink: 0 } },
          React.createElement("button", {
            onClick: function() { setAboutOpen(false); },
            style: { width: "100%", padding: "10px 0", background: "#1a4a32", border: "none", borderRadius: 4, color: "#f0f8f4", fontSize: 14, fontFamily: fontSerif, fontStyle: "italic", cursor: "pointer" }
          }, "Close")
        ),

        React.createElement("div", { style: { position: "absolute", bottom: -1, left: 40, right: 40, height: 2, background: "#c4a030" } })
      )
    ) : null,

    // ── USER GUIDE MODAL ──
    guideOpen ? React.createElement("div", {
      onClick: function(e) { if (e.target === e.currentTarget) setGuideOpen(false); },
      style: { position: "fixed", inset: 0, background: "rgba(26,74,50,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }
    },
      React.createElement("div", { style: { background: "#f5f0e8", border: "2px solid #1a4a32", borderRadius: 6, maxWidth: 560, width: "100%", maxHeight: "88vh", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", fontFamily: fontSerif } },

        // Header bar
        React.createElement("div", { style: { background: "#1a4a32", borderRadius: "4px 4px 0 0", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 } },
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily: fontSC, fontSize: 17, fontWeight: 600, color: "#f0f8f4", letterSpacing: "0.06em" } }, L.seminary),
            React.createElement("div", { style: { fontFamily: fontSans, fontSize: 10, color: "#7aaa88", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 } }, L.guide.title)
          ),
          React.createElement("button", { onClick: function() { setGuideOpen(false); }, style: { background: "none", border: "none", color: "#7aaa88", fontSize: 20, cursor: "pointer", lineHeight: 1 } }, "\u00D7")
        ),

        // Gold rule
        React.createElement("div", { style: { height: 2, background: T.goldLight, flexShrink: 0 } }),

        // Scrollable content
        React.createElement("div", { style: { overflowY: "auto", padding: "24px 28px", flex: 1 } },

          React.createElement("p", { style: { fontSize: 15, lineHeight: 1.85, color: T.ink, fontWeight: 300, marginBottom: 20 } }, L.guide.intro),

          React.createElement("div", { style: { fontFamily: fontSC, fontSize: 14, fontWeight: 600, color: "#1a4a32", letterSpacing: "0.08em", borderBottom: "1px solid #c0d0c4", paddingBottom: 6, marginBottom: 12, marginTop: 8 } }, L.guide.interfaceTitle),
          ...L.guide.items.map(function(item) { return guideItem(item[0], item[1]); }),

          React.createElement("div", { style: { fontFamily: fontSC, fontSize: 14, fontWeight: 600, color: "#1a4a32", letterSpacing: "0.08em", borderBottom: "1px solid #c0d0c4", paddingBottom: 6, marginBottom: 12, marginTop: 24 } }, L.guide.simpleTitle),
          ...L.guide.simpleItems.map(function(item) { return guideItem(item[0], item[1]); }),

          React.createElement("div", { style: { fontFamily: fontSC, fontSize: 14, fontWeight: 600, color: "#1a4a32", letterSpacing: "0.08em", borderBottom: "1px solid #c0d0c4", paddingBottom: 6, marginBottom: 12, marginTop: 24 } }, L.guide.courseTitle),
          ...L.guide.courseItems.map(function(item) { return guideItem(item[0], item[1]); }),

          React.createElement("div", { style: { fontFamily: fontSC, fontSize: 14, fontWeight: 600, color: "#1a4a32", letterSpacing: "0.08em", borderBottom: "1px solid #c0d0c4", paddingBottom: 6, marginBottom: 12, marginTop: 24 } }, L.guide.installTitle),
          ...L.guide.installItems.map(function(item) { return guideItem(item[0], item[1]); }),

          spacerDiv()
        ),

        // Footer with download button
        React.createElement("div", { style: { borderTop: "1px solid #c0d0c4", padding: "14px 24px", background: "#ede8dc", borderRadius: "0 0 4px 4px", flexShrink: 0, display: "flex", gap: 10, alignItems: "center" } },
          React.createElement("a", {
            href: L.guide.pdfPath,
            target: "_blank",
            rel: "noopener noreferrer",
            style: { flex: 1, textAlign: "center", padding: "10px 0", background: "#1a4a32", borderRadius: 4, color: "#f0f8f4", fontSize: 13, fontFamily: "sans-serif", textDecoration: "none", display: "block" }
          }, L.guide.downloadBtn),
          React.createElement("button", {
            onClick: function() { setGuideOpen(false); },
            style: { padding: "10px 18px", background: "transparent", border: "1px solid #1a4a32", borderRadius: 4, color: "#1a4a32", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer", whiteSpace: "nowrap" }
          }, L.guide.closeBtn)
        ),

        React.createElement("div", { style: { position: "absolute", bottom: -1, left: 40, right: 40, height: 2, background: T.goldLight } })
      )
    ) : null

    ,
    // ── CONFIRM CLEAR MODAL ──
    confirmClear ? React.createElement("div", {
      onClick: function(e) { if (e.target === e.currentTarget) setConfirmClear(false); },
      style: { position: "fixed", inset: 0, background: "rgba(26,74,50,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }
    },
      React.createElement("div", { style: { background: "#f5f0e8", border: "2px solid #1a4a32", borderRadius: 6, padding: "36px 40px", maxWidth: 420, width: "100%", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", fontFamily: fontSerif } },

        React.createElement("div", { style: { position: "absolute", top: -1, left: 40, right: 40, height: 2, background: T.goldLight } }),

        React.createElement("button", {
          onClick: function() { setConfirmClear(false); },
          style: { position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 18, color: T.inkFaint, cursor: "pointer", lineHeight: 1 }
        }, "\u00D7"),

        React.createElement("div", { style: { fontFamily: fontSC, fontSize: 19, fontWeight: 600, color: "#1a4a32", textAlign: "center", letterSpacing: "0.06em", marginBottom: 12 } }, "Start New Conversation?"),

        React.createElement("div", { style: { height: 1, background: T.goldLight, margin: "0 0 18px" } }),

        React.createElement("p", { style: { fontSize: 16, lineHeight: 1.85, color: T.ink, fontWeight: 300, textAlign: "center", marginBottom: 8 } },
          getSessionContext()
        ),

        React.createElement("p", { style: { fontSize: 15, lineHeight: 1.8, color: "#7a3a2a", fontWeight: 300, fontStyle: "italic", textAlign: "center", marginBottom: 20 } },
          "Starting a new conversation will clear your current progress. This cannot be undone."
        ),

        // Download option
        React.createElement("button", {
          onClick: function() { downloadConversationPDF(messages); },
          style: { width: "100%", padding: "10px 0", background: "#e8ece8", border: "1px solid #1a4a32", borderRadius: 4, color: "#1a4a32", fontSize: 14, fontFamily: fontSerif, fontStyle: "italic", cursor: "pointer", marginBottom: 16 }
        }, "\u2193 Download Conversation as PDF First"),

        React.createElement("div", { style: { display: "flex", gap: 12 } },
          React.createElement("button", {
            onClick: function() { setConfirmClear(false); },
            style: { flex: 1, padding: "12px 0", background: "#ede8dc", border: "1px solid #c0d0c4", borderRadius: 4, color: "#1a4a32", fontSize: 15, fontFamily: fontSerif, fontStyle: "italic", cursor: "pointer" }
          }, "Keep My Progress"),
          React.createElement("button", {
            onClick: confirmNewConversation,
            style: { flex: 1, padding: "12px 0", background: "#3a1a14", border: "none", borderRadius: 4, color: "#f8e8e0", fontSize: 15, fontFamily: fontSerif, fontStyle: "italic", cursor: "pointer" }
          }, "Clear & Start Over")
        ),

        React.createElement("div", { style: { position: "absolute", bottom: -1, left: 40, right: 40, height: 2, background: T.goldLight } })
      )
    ) : null

    ,
    // ── TIP MODAL ──
    tipOpen ? React.createElement("div", {
      onClick: function(e) { if (e.target === e.currentTarget) setTipOpen(false); },
      style: { position: "fixed", inset: 0, background: "rgba(26,74,50,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }
    },
      React.createElement("div", { style: { background: "#f5f0e8", border: "2px solid #1a4a32", borderRadius: 6, padding: "36px 40px", maxWidth: 420, width: "100%", position: "relative", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", fontFamily: fontSerif } },

        // Gold rule at top
        React.createElement("div", { style: { position: "absolute", top: -1, left: 40, right: 40, height: 2, background: T.goldLight } }),

        // Close button
        React.createElement("button", {
          onClick: function() { setTipOpen(false); },
          style: { position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 18, color: T.inkFaint, cursor: "pointer", lineHeight: 1 }
        }, "\u00D7"),

        // Monogram
        React.createElement("div", { style: { width: 52, height: 52, borderRadius: "50%", border: "2px solid #1a4a32", background: "#ede8dc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", position: "relative" } },
          React.createElement("div", { style: { position: "absolute", inset: 3, borderRadius: "50%", border: "1px solid " + T.goldLight } }),
          React.createElement("span", { style: { fontFamily: fontSC, fontSize: 14, fontWeight: 600, color: "#1a4a32", position: "relative", zIndex: 1 } }, "JRL")
        ),

        // Title
        React.createElement("div", { style: { fontFamily: fontSC, fontSize: 20, fontWeight: 600, color: "#1a4a32", textAlign: "center", letterSpacing: "0.06em", marginBottom: 8 } }, "Tip Theologian Lewis"),

        // Divider
        React.createElement("div", { style: { height: 1, background: T.goldLight, margin: "12px 0 18px" } }),

        // Message
        React.createElement("p", { style: { fontSize: 16, lineHeight: 1.8, color: T.ink, fontWeight: 300, fontStyle: "italic", textAlign: "center", marginBottom: 24 } },
          "\u201CYour generosity keeps Emerald City Seminary open to all who seek it. Every gift, large or small, is received with gratitude.\u201D"
        ),

        // Suggested amounts
        React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 } },
          ["$5", "$10", "$25"].map(function(amt) {
            return React.createElement("a", {
              key: amt,
              href: "https://www.paypal.biz/emeraldcitysanctuary",
              target: "_blank",
              rel: "noopener noreferrer",
              style: { flex: 1, textAlign: "center", padding: "10px 0", background: "#ede8dc", border: "1px solid #c0d0c4", borderRadius: 4, color: "#1a4a32", fontSize: 17, fontFamily: fontSerif, fontWeight: 600, textDecoration: "none", cursor: "pointer" }
            }, amt);
          })
        ),

        // Main PayPal button
        React.createElement("a", {
          href: "https://www.paypal.biz/emeraldcitysanctuary",
          target: "_blank",
          rel: "noopener noreferrer",
          style: { display: "block", width: "100%", textAlign: "center", padding: "13px 0", background: "#1a4a32", border: "none", borderRadius: 4, color: "#f0f8f4", fontSize: 15, fontFamily: fontSerif, fontStyle: "italic", textDecoration: "none", letterSpacing: "0.04em" }
        }, "\u2726 Donate via PayPal"),

        // Footer note
        React.createElement("p", { style: { fontSize: 11, color: T.inkFaint, textAlign: "center", marginTop: 14, fontStyle: "italic" } },
          "Secure payment via PayPal. All amounts welcome."
        ),

        // Gold rule at bottom
        React.createElement("div", { style: { position: "absolute", bottom: -1, left: 40, right: 40, height: 2, background: T.goldLight } })
      )
    ) : null

  );
}
