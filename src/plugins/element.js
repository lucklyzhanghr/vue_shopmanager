import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Row,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Table,
  TableColumn,
  Breadcrumb,
  Card,
  BreadcrumbItem,
  Switch,
  Tooltip,
  Pagination,
  Col,
  Dialog,
  MessageBox,
  Scrollbar
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Scrollbar)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
