<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class My_excel {
	/**
	 * 导出excel 2007
	 * @param $array 二维数组
	 */
    function export($array, $title){
    	require_once 'application/phpexcel/PHPExcel.php';
    	$objPHPExcel = new PHPExcel();
    	$objPHPExcel
	      ->getProperties()  //获得文件属性对象，给下文提供设置资源
	      ->setCreator( "Maarten Balliauw")                 //设置文件的创建者
	      ->setLastModifiedBy( "Maarten Balliauw")          //设置最后修改者
	      ->setTitle( "Office 2007 XLSX Test Document" )    //设置标题
	      ->setSubject( "Office 2007 XLSX Test Document" )  //设置主题
	      ->setDescription( "Test document for Office 2007 XLSX, generated using PHP classes.") //设置备注
	      ->setKeywords( "office 2007 openxml php")        //设置标记
	      ->setCategory( "Test result file");                //设置类别
		// 位置aaa  *为下文代码位置提供锚
		// 给表格添加数据
		
		$c = array('A','B','C','D','E','F','G','H','I','J','K','L');
		$list_count = count($array[0]);
		
		$total = count($array);
		for($i=0; $i<$total; $i++){
			for($j=0; $j<$list_count; $j++){
				$objPHPExcel->setActiveSheetIndex(0)->setCellValueExplicit($c[$j].($i+1), $array[$i][$j], PHPExcel_Cell_DataType::TYPE_STRING);
			}
		}
		
		//得到当前活动的表,注意下文教程中会经常用到$objActSheet
		$objActSheet = $objPHPExcel->getActiveSheet();
		// 位置bbb  *为下文代码位置提供锚
		// 给当前活动的表设置名称
		$objActSheet->setTitle($title);
		    		
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename="'.$title.'.xlsx"');
		
		$objWriter = PHPExcel_IOFactory:: createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save( 'php://output');
    }
}
?>