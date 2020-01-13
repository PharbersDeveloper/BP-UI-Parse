"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IAttrs, IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
import BPSlot from "../slotleaf/BPSlot"

export default class BPTable extends BPWidget {
    constructor(output: string, name: string, routeName: string) {
            super(output, name, routeName)
        }
    public paint(ctx: BPCtx, comp: BPComp, isShow: boolean) {
        const execList: any[] = []

        const options: IOptions = {
                comp,
                hbsData: this.paintHBS(comp),
                logicData: this.paintLogic(comp), // js
                output: this.output,
                pName: this.projectName,
                rName: this.routeName,
                showData: this.paintShow(comp), // hbs
                styleData: this.paintStyle(comp) //  继承自 BPWidget 的方法, css
        }
        execList.push(new CompExec(options, isShow))

        return execList
        }

    public paintShow(comp: BPComp) {
        const { attrs, styleAttrs } = comp
        // TODO  action / event / state
        const attrsBody = this.showProperties([...attrs, ...styleAttrs], comp)
        // 判断attrs 中是否有 classNames ，如果没有，则使用 className 属性的值
        const isClassNames = attrs.some((attr: IAttrs) => attr.name === "classNames")
        const classNames: string = isClassNames ? "" : `classNames="${comp.className.split(",").join(" ")}"`

        // return `{{${comp.name} ssc="ssc" emit="emit"
        //     disconnect="disconnect" ${attrsBody}}}`
        return `{{${comp.name}  ${classNames} ${attrsBody}}}`
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const {attrs, styleAttrs, events } = comp
        const attrsBody = this.logicAttrs([...attrs, styleAttrs])
        let classNameBindings = ""
        styleAttrs.forEach((item: IAttrs) => {
            classNameBindings += `"${item.name}",`
        })
        const fileData = "\n" +
            `import {computed} from '@ember/object';
            import { A } from '@ember/array';
            import { all } from 'rsvp';
            import { inject as service } from '@ember/service';
            import { isEmpty, typeOf } from '@ember/utils';

            export default Component.extend({
                layout,
                ajax: service(),
                classNames:["${comp.name}"],
                content: 'default',
                classNameBindings: ['border:border-table',${classNameBindings}],
                attributeBindings: [''],
                ${attrsBody}
                didInsertElement() {
                    this._super(...arguments);
                    this.getData()

                    const that = this
                    const thisComp = document.getElementById(this.get('tid'))
                    const table = thisComp.getElementsByClassName('ember-table')[0]

                    table.onscroll = function(){
                        const ths = table.getElementsByTagName('th')
                        const length = ths.length
                        const leftWidth = ths[0].offsetWidth
                        const leftHeight = table.offsetHeight

                        const rightWidth = ths[length-2].offsetWidth

                        that.set('leftWidth', leftWidth)
                        that.set('leftHeight', leftHeight)
                        that.set('rightWidth', rightWidth)
                        if ((ths[1].offsetLeft - ths[0].offsetLeft) >= leftWidth) {
                            that.set('tableLeftFixed', false)
                        } else {
                            that.set('tableLeftFixed', true)
                        }

                        if ((ths[length-1].offsetLeft - ths[length-2].offsetLeft) < rightWidth) {
                            that.set('tableRightFixed', true)
                        } else {
                            that.set('tableRightFixed', false)
                        }
                    }
                },
                generateTableOption(condition) {
                    const query = condition.query // query.xSql query.dimensionSql query.chartSql
                    const encode = condition.encode
                    const queryAddress = query.address
                    const ajax = this.ajax

                    let getXValues = this.get('ajax').request( queryAddress + '?tag=array', {
                        method: 'POST',
                        data: JSON.stringify({"sql":query.xSql}),
                        dataType: 'json'
                    })

                    getXValues.then(data => {
                        this.set("xValues", data)
                        let arrC = []
                        arrC.push({ name: "药品名", valuePath: "YM", width: 200,isFixed: 'left',  isSortable: false})
                        data.forEach(it => {
                            arrC.push({name:  it , valuePath: ` + "`${it}`"  + `, isSortable: true})
                        })

                        this.set("columns", arrC)

                        return ajax.request(queryAddress + '?tag=array', {
                            method: 'POST',
                            data: JSON.stringify({"sql": query.dimensionSql}),
                            dataType: 'json'
                        }).then(data => {
                            return all(data.map(ele => {
                                let reqBody = {
                                    "sql": query.chartSql.replace(encode.placeHolder, ele),
                                    "x-values": this.xValues
                                }
                                return ajax.request(queryAddress + '?tag=chart&x-axis='+encode.x+'&y-axis='+encode.y+'&dimensionKeys='+encode.dimension, {
                                    method: 'POST',
                                    data: JSON.stringify(reqBody),
                                    dataType: 'json'
                                })
                            }))
                        }).then(data => {
                            // let allData = []
                            let arrR = []
                            data.forEach(ele => {
                                let obj = {}
                                ele[0].forEach((it, index) => {
                                    if (!ele[1][index]) {
                                        obj[it] = 0
                                    } else {
                                        let isNum = ele[1][index]
                                        if (typeOf(isNum) === "number") {
                                            obj[it] = isNum.toFixed(6)
                                        } else {
                                            obj[it] = isNum
                                        }
                                    }

                                })
                                arrR.push(obj)
                            })
                            this.set('rows', arrR)
                        })
                    })
                },
                getData() {
                    if (!this.get('rows') && !this.get('columns')) {
                        const tableId = this.get('tid')
                        this.get('ajax').request(this.get("confReqAdd") + "/chartsConfig", {
                            method: 'GET',
                            data: tableId
                        }).then(data => {
                            if (!isEmpty(data.id) && !isEmpty(data.condition)) {
                                this.setProperties({
                                    dataCondition: data.condition
                                });
                                this.generateTableOption(data.condition);
                            }
                        })
                    }
                },
                actions: {
                    sortSowIcon(sorts) {
                        this.set('sorts', sorts)
                        this.columns.forEach(it => {
                            it.isAscending = false
                            it.isDesending = false

                            if (sorts.length >= 1) {
                                if(it.valuePath === sorts[0].valuePath) {
                                    it.isAscending = sorts[0].isAscending
                                    it.isDesending = !sorts[0].isAscending
                                }
                            }
                        })
                    }
                },`

        return fileDataStart + fileData + fileDataEnd
    }

    public paintHBS(comp: BPComp) {
       return  `<div class="bp-table" id={{tid}}>
        {{#if tableLeftFixed}}
            <div style="box-shadow: 4px 0px 4px -4px rgba(0,0,0,.12);position:absolute;height:{{leftHeight}}px;width: {{leftWidth}}px;z-index:6;background:transparent;"></div>
        {{else if tableRightFixed}}
        <div style="right:0;box-shadow: -4px 0px 4px -4px rgba(0,0,0,.12);position:absolute;height:{{leftHeight}}px;width: {{rightWidth}}px;z-index:6;background:transparent;"></div>
        {{/if}}
       <EmberTable as |t|>
       <t.head @sorts={{sorts}}
       @onUpdateSorts='sortSowIcon'
       @columns={{columns}} as |h|>
            <h.row as |r|>
                <r.cell as |column|>
                        {{column.name}}
                        {{#if column.isSortable}}
                            {{#if column.isAscending}}
                                {{svg-jar 'sort-asc' width='12px' height='12px' class='icon-margin-left'}}
                            {{else if column.isDesending}}
                                {{svg-jar 'sort-des' width='12px' height='12px' class='icon-margin-left'}}
                            {{else}}
                                {{svg-jar 'sort-default' width='12px' height='12px' class='icon-margin-left'}}
                            {{/if}}
                        {{/if}}

                </r.cell>
            </h.row>
            </t.head>
            <t.body @rows={{rows}} as |b|>
                <b.row as |r|>
                <r.cell as |cell column|>
                    {{#if column.cellComponent}}
                    {{#component column.cellComponent}}
                        {{cell}}
                    {{/component}}
                    {{else}}
                    {{cell}}
                    {{/if}}
                </r.cell>
                </b.row>
            </t.body>
            </EmberTable>
            </div>`
    }
}
