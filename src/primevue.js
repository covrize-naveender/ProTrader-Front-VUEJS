import Vue from "vue";
import VeeValidate from 'vee-validate';
import PrimeVue from "primevue/config";


// Import PrimeVue themes and styles
import "primevue/resources/themes/saga-blue/theme.css"; // or your preferred theme
import "primevue/resources/primevue.min.css";          // PrimeVue core CSS
import "primeicons/primeicons.css";        
        // Icons

// Import the components you need
import Button from "primevue/button";
import Toolbar from 'primevue/toolbar';
import Menu from 'primevue/menu';
import TieredMenu from 'primevue/tieredmenu';
import Dropdown from 'primevue/dropdown';
import SplitButton from 'primevue/splitbutton';
import Listbox from 'primevue/listbox';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password  from "primevue/password";
import Message from 'primevue/message'
import InlineMessage from 'primevue/inlinemessage'
import PanelMenu from 'primevue/panelmenu'
import ScrollPanel from 'primevue/scrollpanel';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Tree from 'primevue/tree'    
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import InputSwitch from 'primevue/inputswitch';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import BlockUI from 'primevue/blockui';
import Textarea from 'primevue/textarea';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Tooltip from 'primevue/tooltip';
import Steps from 'primevue/steps';
import OverlayPanel from 'primevue/overlaypanel';
import InputNumber from 'primevue/inputnumber';

// Use PrimeVue globally
Vue.use(VeeValidate);
Vue.use(PrimeVue);
Vue.directive('tooltip', Tooltip);
// Register the components globally
Vue.component("p-button", Button);
Vue.component("p-toolbar", Toolbar);
Vue.component("p-tieredMenu", TieredMenu);
Vue.component("p-dropdown", Dropdown);
Vue.component("p-splitButton", SplitButton);
Vue.component("p-menu", Menu);
Vue.component("p-listbox", Listbox);
Vue.component("p-dialog", Dialog);
Vue.component("p-inputText", InputText);
Vue.component("p-password", Password);
Vue.component("p-message", Message);
Vue.component("p-inlinemessage", InlineMessage);
Vue.component("p-panelmenu", PanelMenu);
Vue.component("p-scrollpanel", ScrollPanel);
Vue.component("p-accordion", Accordion);
Vue.component("p-accordiontab", AccordionTab);
Vue.component("p-tree", Tree);
Vue.component("p-card", Card);
Vue.component("p-panel", Panel);
Vue.component("p-datatable", DataTable);
Vue.component("p-column", Column);
Vue.component("p-progressspinner", ProgressSpinner);
Vue.component("p-checkbox", Checkbox);
Vue.component("p-divider", Divider);
Vue.component("p-inputswitch", InputSwitch);
Vue.component("p-radiobutton", RadioButton);
Vue.component("p-selectbutton", SelectButton);
Vue.component("p-blockui", BlockUI);
Vue.component("p-textarea", Textarea);
Vue.component("p-tabview", TabView);
Vue.component("p-tabpanel", TabPanel);
Vue.component("p-steps", Steps);
Vue.component("p-overlaypanel", OverlayPanel);
Vue.component("p-inputnumber", InputNumber );

