

import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome';
import { connect } from 'dva'
import moment from 'moment'
import BooleanOption from 'components/BooleanOption';
import { Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Tooltip, Menu, Dropdown,Badge, Switch,Select,Form,AutoComplete,Modal } from 'antd'
import { Link, Route, Redirect} from 'dva/router'
import numeral from 'numeral'
import {
  ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart,
} from '../../components/Charts'
import Trend from '../../components/Trend'
import NumberInfo from '../../components/NumberInfo'
import { getTimeDistance } from '../../utils/utils'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import styles from './Goods.preference.less'
import DescriptionList from '../../components/DescriptionList';
import ImagePreview from '../../components/ImagePreview';
import GlobalComponents from '../../custcomponents';
import PermissionSetting from '../../permission/PermissionSetting'
const { Description } = DescriptionList;
const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { Option } = Select

const topColResponsiveProps = {
  xs: 8,
  sm: 6,
  md: 6,
  lg: 4,
  xl: 4,
  style: { marginBottom: 24 },
}


const internalImageListOf = (goods) =>{

  const imageList = [
	 ]
  const filteredList = imageList.filter((item)=>item.imageLocation!=null)
  if(filteredList.length===0){
    return null
  }

  return(<Card title='图片列表' className={styles.card}><Row type="flex" justify="start" align="bottom">
  {
      filteredList.map((item,index)=>(<Col span={4} key={index}><ImagePreview imageTitle ={item.title} showTitleUnderImage={true} imageLocation={item.imageLocation} >{item.title}</ImagePreview></Col>))
  }</Row></Card> )

}

const internalSettingListOf = (goods) =>{

	const optionList = [ 
	]
	
  if(optionList.length===0){
    return null
  }
  return(<Card title='状态集合' className={styles.card}>
  	
  	{
  	  optionList.map((item)=><Col key={item.parameterName} span={6} style={{"height":"60px"}}>
       <Switch  title={item.title} checked={item.value} type={item.value?"success":"error"} checkedChildren="是" unCheckedChildren="否" />
       <span style={{"margin":"10px"}}>{item.title}</span>
       </Col>)
  	}


</Card> )
	


}

const internalLargeTextOf = (goods) =>{

	return null
	

}

/////////////////////////////////////// BUILD FOR TRANSFERRING TO ANOTHER OBJECT////////////////////////////////////////////////

const handleTransferSearch =(targetComponent,filterKey,newRequest)=>{
  const {GoodsService} = GlobalComponents;

  const parameters = newRequest||targetComponent.state

  const {
 
    candidateServiceName,
    candidateObjectType,
    targetLocalName,
 
  } = parameters

  console.log("current state", parameters)

  const id = "";//not used for now
  const pageNo = 1;
  const candidateReferenceService = GoodsService[candidateServiceName] 
  if(!candidateReferenceService){
    console.log("current state", parameters)
    return;
  }
  //get a function for fetching the candidate reference list
  const future = candidateReferenceService(candidateObjectType, id, filterKey, pageNo);
  console.log(future);
  future.then(candidateReferenceList=>{
    targetComponent.setState({
     ...parameters,
      candidateReferenceList,
      transferModalVisiable:true,transferModalTitle:"重新分配<"+targetLocalName+">"
     
    })

  })

}
//  onClick={()=>showTransferModel(targetComponent,"城市","city","requestCandidateDistrict","transferToAnotherDistrict")} 

const showTransferModel = (targetComponent,targetLocalName,
  candidateObjectType,candidateServiceName, transferServiceName, transferTargetParameterName,currentValue) => {

  const filterKey = ""

  const newRequest = {targetLocalName,candidateObjectType,candidateServiceName,transferServiceName,transferTargetParameterName,currentValue}
  console.log("showTransferModel  new state", newRequest)
  //targetComponent.setState(newState);
  handleTransferSearch(targetComponent,filterKey,newRequest)
}

const hideCloseTrans = (targetComponent) =>{
  targetComponent.setState({transferModalVisiable:false})

}

const executeTrans = (goods,targetComponent) =>{
  const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = targetComponent.props.form
  const {
   
    candidateServiceName,
    candidateObjectType,
    targetLocalName,
    transferServiceName
  } = targetComponent.state

  const {dispatch} = targetComponent.props

  validateFieldsAndScroll((error, values) => {
    console.log("error", values)

    const parameters  = {...values}
    const id=goods.id;
    const serviceNameToCall = transferServiceName;

    const payload = {parameters,id,serviceNameToCall}
    
    //targetComponent.setState({transferModalVisiable:false})
    dispatch({type:"_goods/doJob",payload: payload})

    targetComponent.setState({transferModalVisiable:false})

  })
 

}


const buildTransferModal = (goods,targetComponent) => {


  const {transferModalVisiable,targetLocalName,transferModalTitle,
    candidateReferenceList,transferTargetParameterName,currentValue} = targetComponent.state
  const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = targetComponent.props.form


  if(!candidateReferenceList||!candidateReferenceList.candidates){
    return null;
  }


  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  return(

<Modal title={transferModalTitle}
          visible={transferModalVisiable}
          onOk={()=>executeTrans(goods,targetComponent)}
          onCancel={()=>hideCloseTrans(targetComponent)}
          
        >

  <Form >
            <Row gutter={16}>

              <Col lg={24} md={24} sm={24}>
                <Form.Item label={`请选择新的${targetLocalName}`} {...formItemLayout}>
                  {getFieldDecorator(transferTargetParameterName, {
                    rules: [{ required: true, message: '请搜索' }],
                    initialValue: currentValue
                  })(
                    <AutoComplete
                    dataSource={candidateReferenceList.candidates}
                    onSearch={(value)=>handleTransferSearch(targetComponent,value)}
                    >
                   {candidateReferenceList.candidates.map(item=>{
                return (<Option key={item.id}>{`${item.displayName}(${item.id})`}</Option>);
            })}
                    
                    </AutoComplete>
                  )}
                </Form.Item>
              </Col></Row>
              </Form>

          
        </Modal>)


}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const internalRenderExtraHeader = (goods) =>{
	return null
}
const internalRenderExtraFooter = (goods) =>{
	return null
}
const internalSubListsOf = (cardsData) =>{
	const {id} = cardsData.cardsSource;
	return (<Row gutter={24}>

           {cardsData.subItems.sort((x,y)=>x.displayName.localeCompare(y.displayName, 'zh-CN')).map((item)=>(<Col {...topColResponsiveProps} key={item.name}>   
            <Card title={`${item.displayName}(${numeral(item.count).format('0,0')})`}  style={{ width: 180 }}>             
              <p><Link to={`/${cardsData.cardsFor}/${id}/list/${item.name}/${item.displayName}列表`}><FontAwesome name="list"  />&nbsp;管理</Link>
              
              {item.addFunction&&(<Link to={`/${cardsData.cardsFor}/${id}/list/${item.role}CreateForm`}><span className={styles.splitLine}></span><FontAwesome name="plus"  />&nbsp;新增</Link>)}   
              
              </p>         
          </Card> 
            </Col>))}
          </Row>)
}

const internalSummaryOf = (goods,targetComponent) =>{

	return (
	<DescriptionList className={styles.headerList} size="small" col="4">
<Description term="序号">{goods.id}</Description> 
<Description term="名称">{goods.name}</Description> 
<Description term="RFID">{goods.rfid}</Description> 
<Description term="计量单位">{goods.uom}</Description> 
<Description term="最大包装">{goods.maxPackage}</Description> 
<Description term="到期时间">{ moment(goods.expireTime).format('YYYY-MM-DD')}</Description> 
<Description term="SKU">{goods.sku==null?"未分配":goods.sku.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"SKU","sku","requestCandidateSku",
	      "transferToAnotherSku","anotherSkuId",goods.sku?goods.sku.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="收货区">{goods.receivingSpace==null?"未分配":goods.receivingSpace.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"收货区","receivingSpace","requestCandidateReceivingSpace",
	      "transferToAnotherReceivingSpace","anotherReceivingSpaceId",goods.receivingSpace?goods.receivingSpace.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="货位">{goods.goodsAllocation==null?"未分配":goods.goodsAllocation.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"货位","goodsAllocation","requestCandidateGoodsAllocation",
	      "transferToAnotherGoodsAllocation","anotherGoodsAllocationId",goods.goodsAllocation?goods.goodsAllocation.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="智能托盘">{goods.smartPallet==null?"未分配":goods.smartPallet.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"智能托盘","smartPallet","requestCandidateSmartPallet",
	      "transferToAnotherSmartPallet","anotherSmartPalletId",goods.smartPallet?goods.smartPallet.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="发货区">{goods.shippingSpace==null?"未分配":goods.shippingSpace.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"发货区","shippingSpace","requestCandidateShippingSpace",
	      "transferToAnotherShippingSpace","anotherShippingSpaceId",goods.shippingSpace?goods.shippingSpace.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="运输任务">{goods.transportTask==null?"未分配":goods.transportTask.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"运输任务","transportTask","requestCandidateTransportTask",
	      "transferToAnotherTransportTask","anotherTransportTaskId",goods.transportTask?goods.transportTask.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="双链小超">{goods.retailStore==null?"未分配":goods.retailStore.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"双链小超","retailStore","requestCandidateRetailStore",
	      "transferToAnotherRetailStore","anotherRetailStoreId",goods.retailStore?goods.retailStore.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="订单">{goods.bizOrder==null?"未分配":goods.bizOrder.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"订单","supplyOrder","requestCandidateBizOrder",
	      "transferToAnotherBizOrder","anotherBizOrderId",goods.bizOrder?goods.bizOrder.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="生超的订单">{goods.retailStoreOrder==null?"未分配":goods.retailStoreOrder.displayName}
 <Icon type="swap" onClick={()=>
  showTransferModel(targetComponent,"生超的订单","retailStoreOrder","requestCandidateRetailStoreOrder",
	      "transferToAnotherRetailStoreOrder","anotherRetailStoreOrderId",goods.retailStoreOrder?goods.retailStoreOrder.id:"")} 
  style={{fontSize: 20,color:"red"}} />
</Description>
<Description term="当前状态">{goods.currentStatus}</Description> 
	
        {buildTransferModal(goods,targetComponent)}
      </DescriptionList>
	)

}


const renderPermissionSetting = goods => {
  const {GoodsBase} = GlobalComponents
  return <PermissionSetting targetObject={goods}  targetObjectMeta={GoodsBase}/>


}


class GoodsPreference extends Component {

  state = {
    transferModalVisiable: false,
    candidateReferenceList: {},
    candidateServiceName:"",
    candidateObjectType:"city",
    targetLocalName:"城市",
    transferServiceName:"",
    currentValue:"",
    transferTargetParameterName:""


  }
  componentDidMount() {

  }
  

  render() {
    // eslint-disable-next-line max-len
    const { id,displayName, goodsMovementCount } = this.props.goods
    const cardsData = {cardsName:"货物",cardsFor: "goods",cardsSource: this.props.goods,
  		subItems: [
    
      	],
  	};
    //下面各个渲染方法都可以定制，只要在每个模型的里面的_features="custom"就可以得到定制的例子
    
    const renderExtraHeader = this.props.renderExtraHeader || internalRenderExtraHeader
    const settingListOf = this.props.settingListOf || internalSettingListOf
    const imageListOf = this.props.imageListOf || internalImageListOf
    const subListsOf = this.props.subListsOf || internalSubListsOf
    const largeTextOf = this.props.largeTextOf ||internalLargeTextOf
    const summaryOf = this.props.summaryOf || internalSummaryOf
    const renderExtraFooter = this.props.renderExtraFooter || internalRenderExtraFooter
    /*
    {settingListOf(cardsData.cardsSource)}
        {imageListOf(cardsData.cardsSource)}
        {subListsOf(cardsData)} 
        {largeTextOf(cardsData.cardsSource)}
    */
    return (

      <PageHeaderLayout
        title={`${cardsData.cardsName}: ${displayName}`}
        content={summaryOf(cardsData.cardsSource,this)}
        wrapperClassName={styles.advancedForm}
      >
      {renderPermissionSetting(cardsData.cardsSource)}
      {renderExtraHeader(cardsData.cardsSource)}
        <div>
       
        {subListsOf(cardsData)} 
          
        </div>
      </PageHeaderLayout>
    )
  }
}

export default connect(state => ({
  goods: state._goods,
}))(Form.create()(GoodsPreference))

