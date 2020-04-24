
import { BPColumnLayout, BPRowLayout} from "../layouts/layout"
import phLogger from "../logger/phLogger"
import BPAddItem from "../widgets/addItem/BPAddItem"
import BPBadge from "../widgets/badges/BPBadge"
import BPItem from "../widgets/basic/BPItem"
import BPBreadcrumbs from "../widgets/breadcrumbs/BPBreadcrumbs"
import BPButtonGroup from "../widgets/buttons/BPButtonGroup"
import BPButtonItem from "../widgets/buttons/BPButtonItem"
import BPPushButton from "../widgets/buttons/BPPushButton"
import { BPBar , BPBarLine, BPChina, BPLine, BPPie, BPRadar, BPScatter, BPStack} from "../widgets/charts/charts"
import BPCheckbox from "../widgets/checkbox/BPCheckbox"
import BPCheckboxGroup from "../widgets/checkbox/BPCheckboxGroup"
import BPDatePicker from "../widgets/datePicker/BPDatePicker"
import BPDiv from "../widgets/div/BPDiv"
import BPDivider from "../widgets/divider/BPDivider"
import BPCascader from "../widgets/dropdown/BPCascader"
import BPDateSelect from "../widgets/dropdown/BPDateSelect"
import BPOption from "../widgets/dropdown/BPOption"
import BPSelect from "../widgets/dropdown/BPSelect"
import BPSelectMultiple from "../widgets/dropdown/BPSelectMultiple"
import BPEmptyState from "../widgets/emptyState/BPEmptyState"
import BPIcon from "../widgets/icon/BPIcon"
import BPImg from "../widgets/img/BPImg"
import BPInput from "../widgets/inputs/BPInput"
import BPLabel from "../widgets/label/BPLabel"
import BPLink from "../widgets/link/BPLink"
import { ChartCard , ChartCardTitle} from "../widgets/middleComps/MiddleComps"
import BPModal from "../widgets/modal/BPModal"
import BPMenu from "../widgets/navs/BPMenu"
import BPMenuItem from "../widgets/navs/BPMenuItem"
import BPStackLayout from "../widgets/navs/BPStackLayout"
import BPSubMenu from "../widgets/navs/BPSubMenu"
import BPTab from "../widgets/navs/BPTab"
import BPTabBar from "../widgets/navs/BPTabBar"
import BPTabButton from "../widgets/navs/BPTabButton"
import BPPagination from "../widgets/pagination/BPPagination"
import BPPopover from "../widgets/popover/BPPopover"
import BPProgressbar from "../widgets/progressTracker/BPProgressbar"
import BPProgressTracker from "../widgets/progressTracker/BPProgressTracker"
import BPRadio from "../widgets/radio/BPRadio"
import BPRadioGroup from "../widgets/radio/BPRadioGroup"
import BPScrollBar from "../widgets/scrollBar/BPScrollBar"
import BPSpinner from "../widgets/spinner/BPSpinner"
import BPSpotlight from "../widgets/spotlight/BPSpotlight"
import BPStatus from "../widgets/status/BPStatus"
import BPTable from "../widgets/table/BPTable"
import BPTag from "../widgets/tags/BPTag"
import BPText from "../widgets/text/BPText"
import BPTextarea from "../widgets/textarea/BPTextarea"
import BPToast from "../widgets/toast/BPToast"
import BPTooltip from "../widgets/tooltip/BPTooltip"
import BPViewport from "../widgets/viewport/BPViewport"

export class GenCompList {
    public output: string = ""
    public projectName: string = ""
    public routeName: string = ""
    constructor(output: string, projectName: string, routeName: string) {
        this.output = output
        this.projectName = projectName
        this.routeName = routeName
    }
    public createList() {
        return [
            new BPProgressbar(this.output, this.projectName, this.routeName),
            new BPCascader(this.output, this.projectName, this.routeName),
            new BPCheckboxGroup(this.output, this.projectName, this.routeName),
            new BPRadioGroup(this.output, this.projectName, this.routeName),
            new BPDateSelect(this.output, this.projectName, this.routeName),
            new BPSelectMultiple(this.output, this.projectName, this.routeName),
            new BPViewport(this.output, this.projectName, this.routeName),
            new BPIcon(this.output, this.projectName, this.routeName),
            new BPButtonItem(this.output, this.projectName, this.routeName),
            new BPButtonGroup(this.output, this.projectName, this.routeName),
            new BPAddItem(this.output, this.projectName, this.routeName),
            new BPDatePicker(this.output, this.projectName, this.routeName),
            new BPEmptyState(this.output, this.projectName, this.routeName),
            new BPSpotlight(this.output, this.projectName, this.routeName),
            new BPTable(this.output, this.projectName, this.routeName),
            new BPBreadcrumbs(this.output, this.projectName, this.routeName),
            new BPPagination(this.output, this.projectName, this.routeName),
            new BPSpinner(this.output, this.projectName, this.routeName),
            new BPProgressTracker(this.output, this.projectName, this.routeName),
            new BPPopover(this.output, this.projectName, this.routeName),
            new BPModal(this.output, this.projectName, this.routeName),
            new BPToast(this.output, this.projectName, this.routeName),
            new BPTooltip(this.output, this.projectName, this.routeName),
            new BPLink(this.output, this.projectName, this.routeName),
            new BPTextarea(this.output, this.projectName, this.routeName),
            new BPCheckbox(this.output, this.projectName, this.routeName),
            new BPRadio(this.output, this.projectName, this.routeName),
            new BPLabel(this.output, this.projectName, this.routeName),
            new BPDiv(this.output, this.projectName, this.routeName),
            new BPImg(this.output, this.projectName, this.routeName),
            new BPTag(this.output, this.projectName, this.routeName),
            new BPStatus(this.output, this.projectName, this.routeName),
            new BPBadge(this.output, this.projectName, this.routeName),
            new BPScrollBar(this.output, this.projectName, this.routeName),
            new BPDivider(this.output, this.projectName, this.routeName),
            new BPInput(this.output, this.projectName, this.routeName),
            new BPPushButton(this.output, this.projectName, this.routeName),
            new BPMenu(this.output, this.projectName, this.routeName),
            new BPSubMenu(this.output, this.projectName, this.routeName),
            new BPMenuItem(this.output, this.projectName, this.routeName),
            new BPTabBar(this.output, this.projectName, this.routeName),
            new BPItem(this.output, this.projectName, this.routeName),
            new BPStackLayout(this.output, this.projectName, this.routeName),
            new BPTabButton(this.output, this.projectName, this.routeName),
            new BPTab(this.output, this.projectName, this.routeName),
            new BPSelect(this.output, this.projectName, this.routeName),
            new BPOption(this.output, this.projectName, this.routeName),
            new BPLine(this.output, this.projectName, this.routeName),
            new BPBar(this.output, this.projectName, this.routeName),
            new BPPie(this.output, this.projectName, this.routeName),
            new BPScatter(this.output, this.projectName, this.routeName),
            new BPChina(this.output, this.projectName, this.routeName),
            new BPBarLine(this.output, this.projectName, this.routeName),
            new BPRadar(this.output, this.projectName, this.routeName),
            new BPStack(this.output, this.projectName, this.routeName),
            new ChartCardTitle(this.output, this.projectName, this.routeName),
            new ChartCard(this.output, this.projectName, this.routeName),
            new BPText(this.output, this.projectName, this.routeName),
            new BPColumnLayout(this.output, this.projectName, this.routeName),
            new BPRowLayout(this.output, this.projectName, this.routeName)
        ]
    }
}
