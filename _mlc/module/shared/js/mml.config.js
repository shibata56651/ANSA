/* eslint-disable strict */
window.MLC_MODULE_LIST_CONFIG = {
    styleGuide: {
        enabled: true,
        voidElementsFormat: '<>', // <> </> < />
        booleanAttributeFormat: 'attr', // attr attr="" attr="attr"
        removeAllAttributeVoidValue: false, // 全ての属性の「=""」を取り去る
        voidElements: {
            add: [
            ],
            remove: [
            ]
        },
        booleanAttributes: {
            add: [
            ],
            remove: [
            ]
        }
    },
    codeIsReadOnly: true, // MLC_MODULE_CODE の編集を禁止する
    useMarkedJS: true, // Markdown parser ライブラリ「marked」を利用する
    ignoreObsoleteModule: true, // .MLC_MODULE_TITLE > h2 のテキストが ! 始まりのモジュールを無視する
    hashAnchorJump: true,
    toc: true,
    rememberControllerState: true,
    validateSelector: 'strict', // strict | (empty | duplicate | unuseCombinator) | (none | '')
    checkDemoPath: true, // MLC_MODULE_CODEの中にDEMOパスがないか検査する
    checkCurrentPageIsNotPublic: true, // 読み込まれてるページが _mlc 配下であることを検査する
    customBtns: [
        // {
        //     enabled: true,
        //     label: '任意の文字列',
        //     handler: function () {
        //         window.console.log(this);
        //     }
        // },
        (function () {
            'use strict';

            var config = {
                enabled: true,
                label: 'ランダム文字列に置換する',
                handler: null
            };
            var targetModules = null;
            var isPressed = false;
            var html = document.documentElement;
            var labels = [
                'ランダム文字列に置換する',
                'ランダム文字列を元に戻す'
            ];
            var sentence = [
                'あなたは結果もうそういう尊重屋というのの時がなっでう。',
                'あたかも時分に附着家はいよいよその煩悶ますんかもにしからいるますをも入会しですたて、実際にはしたたでない。',
                '勇気に向っまい方はむくむく時間がもっともななです。',
                'すでに張さんより観念奥突然講演を聞いませ自分その人格私か病気がという不危くたないますでと、その当時はそれか壁女がなりて、嘉納君の事で坊ちゃんの私をとうてい皆留学と命じてそこ別にご誤解に信ずるように常にご解釈を云えあるましで、何しろ何だか説明をなりでがいけたものになるますん。',
                'そうしてしかし肝教師を耽り事はそう空虚としないが、そのちりにはおくたがという叫び声をなっとありうな。',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi eos quaerat vero adipisci cum quibusdam necessitatibus molestias voluptatum dolorem, porro perferendis ullam accusantium harum, quisquam inventore repellat optio, pariatur expedita!'
            ];
            var text = {
                exports: [], // sentenceから選ばれたパターン
                defaults: [] // もともとの文字列
            };
            var style = document.createElement('style');

            style.textContent = 'html[data-mlcmodulecontrolbtn-randomtext="true"] .MLC_MODULE_SAMPLE[data-ignore-randomtext=""] {position: relative;}html[data-mlcmodulecontrolbtn-randomtext="true"] .MLC_MODULE_SAMPLE[data-ignore-randomtext=""] > * {opacity: .3;}html[data-mlcmodulecontrolbtn-randomtext="true"] .MLC_MODULE_SAMPLE[data-ignore-randomtext=""]::before {color: #fff;background: #d73336;position: absolute;z-index: 1;top: 50%;left: 50%;padding: 5px;content: "\\30E9\\30F3\\30C0\\30E0\\6587\\5B57\\5217\\7F6E\\63DB\\6A5F\\80FD\\5BFE\\8C61\\5916\\306E\\30E2\\30B8\\30E5\\30FC\\30EB\\3067\\3059"; /* ランダム文字列置換機能対象外のモジュールです */transform: translate(-50%, -50%);}';
            document.head.appendChild(style);

            config.handler = function () {
                if (isPressed) {
                    text.exports.forEach(function (node, idx) {
                        node.textContent = text.defaults[idx];
                    });

                    isPressed = false;
                    this.innerText = labels[0];
                    this.setAttribute('aria-pressed', 'false');
                    html.setAttribute('data-mlcmodulecontrolbtn-randomtext', 'false');

                    return;
                }

                isPressed = true;
                this.innerText = labels[1];
                this.setAttribute('aria-pressed', 'true');
                html.setAttribute('data-mlcmodulecontrolbtn-randomtext', 'true');

                text.exports = [];
                text.defaults = [];
                targetModules = document.querySelectorAll('.MLC_MODULE_SAMPLE:not([data-ignore-randomtext=""])');

                targetModules.forEach(function (sample) {
                    var nodelist = sample.querySelectorAll('*');
                    var ignoreSelector = sample.getAttribute('data-ignore-randomtext');

                    nodelist.forEach(function (elementNode) {
                        var childNodes = null;

                        if (ignoreSelector) {
                            if (Array.prototype.indexOf.call(sample.querySelectorAll(ignoreSelector), elementNode) !== -1) {
                                return;
                            }
                        }

                        childNodes = elementNode.childNodes;
                        childNodes.forEach(function (node) {
                            if (
                                node.nodeType !== 3 ||
                                (
                                    node.textContent &&
                                    node.textContent.trim() === ''
                                )
                            ) {
                                return;
                            }

                            text.exports.push(node);
                            text.defaults.push(node.textContent);
                            node.textContent = (function () {
                                return sentence[Math.round(Math.random() * (sentence.length - 1))];
                            }());
                        });
                    });
                });
            };

            return config;
        }())
    ]
};
