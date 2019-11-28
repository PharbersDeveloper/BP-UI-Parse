"use strict"

// import { TagExec } from "../../bashexec/widgets/tags/tagExec"
import { CompExec } from "../../bashexec/compExec"
import BPCtx from "../../context/BPCtx"
import phLogger from "../../logger/phLogger"
import { IOptions } from "../../properties/Options"
import { BPWidget } from "../BPWidget"
import BPComp from "../Comp"
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
        return "{{#" + comp.name + "}}" + "{{/" + comp.name + "}}"
    }
    public paintLogic(comp: BPComp) {
        // 继承自 BPWidget 的方法
        const fileDataStart = this.paintLoginStart(comp)
        const fileDataEnd = this.paintLoginEnd()
        const borderTable = comp.attrs.border === "true" ? "border-table" : ""

        const fileData = "\n" +
            `import {computed} from '@ember/object';
            import { A } from '@ember/array';
            import { all } from 'rsvp';
            import { inject as service } from '@ember/service';
            export default Component.extend({
                layout,
                ajax: service(),
                tagName:'div',
                classNames:["${comp.name} ${borderTable}"],
                content: 'default',
                classNameBindings: ['block:btn-block', 'reverse', 'active', 'computedIconOnly:icon-only'],
                attributeBindings: [''],
                didInsertElement() {
                    this._super(...arguments);
                    this.getData()
                },
                getData() {
                    const ajax = this.ajax;
                    const queryChartSql = "select 月份, 药品名, count(药品名.keyword) as 数量 from hx2 where 药品名.keyword='***' group by 月份.keyword, 药品名.keyword order by 月份.keyword"
                    const ec = {
                        dimension: "药品名",
                        placeHolder: "***",
                        table: "hx2",
                        x: "月份",
                        y: "数量"
                    }

                    let getXValues = this.get('ajax').request('http://192.168.100.174:3000/sql?tag=array', {
                        method: 'POST',
                        data: JSON.stringify({"sql":"select 月份 from hx2 group by 月份.keyword order by 月份.keyword"}),
                        dataType: 'json'
                    })

                    getXValues.then(data => {
                        this.set("xValues", data)
                        let arrC = []
                        arrC.push({ name: "药品名", valuePath: "月份", width: 200,isFixed: 'left',  isSortable: false})
                        data.forEach(it => {
                            arrC.push({name: it, valuePath: it, isSortable: true})
                        })

                        this.set("columns", arrC)

                        window.console.log(data)
                        return ajax.request("http://192.168.100.174:3000/sql" + '?tag=array', {
                            method: 'POST',
                            data: JSON.stringify({"sql":"select 药品名 from hx2 group by 药品名.keyword order by 药品名.keyword"}),
                            dataType: 'json'
                        }).then(data => {
                            return all(data.map(ele => {
                                let reqBody = {
                                    "sql": queryChartSql.replace(ec.placeHolder, ele),
                                    "x-values": this.xValues
                                }
                                return ajax.request("http://192.168.100.174:3000/sql" + '?tag=chart&x-axis='+ec.x+'&y-axis='+ec.y+'&dimensionKeys='+ec.dimension, {
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
                                        obj[it] = ele[1][index]
                                    }

                                })
                                arrR.push(obj)
                            })
                            window.console.log(arrR)
                            this.set('rows', arrR)
                        })
                    })
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
       return  `<div class="bp-table">
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
            <t.body @rows={{rows}} />
            </EmberTable>
            </div>`
    }
}
