﻿define(["dojo/_base/declare","jquery"], function(declare,$){return declare(null, {constructor: function () {},data : function () {return $.parseXML("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Report isDefault=\"true\" isUser=\"false\" hasUnresolvedCounterQueries=\"false\" version=\"4\" nlname=\"WS_VP_REPORT\" name=\"Service Verification Point Report\" helpProvider=\"com.ibm.rational.test.lt.execution.results\"><features><Feature>com.ibm.rational.test.lt.ws.feature</Feature></features><pages><Page nlname=\"VP_TAB_TITLE_SUMMARY\" name=\"Summary\" helpId=\"wevp0010\"><views><RunStatus></RunStatus><LineChart nlname=\"VP_LINE_TITLE_SUMMARY\" name=\"VP Pass Rate vs. Time\"><counterQueries><QueryInfo path=\"/WS_VP/WS_ALL_VP/Percent_WS_ALL_VPs_Passed_For_Interval/Percent\" label=\"Percent All VPs Passed \" counterType=\"PERCENT\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></LineChart><Table nlname=\"VP_TABLE_TITLE_SUMMARY\" name=\"Verification Point Summary Tab\"><counterQueries><QueryInfo path=\"/WS_VP/WS_ALL_VP/Percent_WS_ALL_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent All VPs Passed \" counterType=\"PERCENT\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/Total_WS_ALL_VPs_Attempted_For_Interval/Cumulated/Count\" label=\"Total All VPs Attempted \" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/Total_WS_ALL_VPs_Passed_For_Interval/Cumulated/Count\" label=\"Total All VPs Passed \" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/Total_WS_ALL_VPs_Failed_For_Interval/Cumulated/Count\" label=\"Total All VPs Failed \" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/Total_WS_ALL_VPs_Error_For_Interval/Cumulated/Count\" label=\"Total All VPs Error \" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_DETAIL\" name=\"Verification Points Detail\" helpId=\"wevp0020\"><views><Table nlname=\"VP_TABLE_TITLE_DETAIL_PASSED\" name=\"Passed\"><counterQueries><QueryInfo path=\"/WS_VP/WS_ALL_VP/[WS_RETURN]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/[WS_RETURN]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table><Table nlname=\"VP_TABLE_TITLE_DETAIL_FAILED\" name=\"Failed\"><counterQueries><QueryInfo path=\"/WS_VP/WS_ALL_VP/[WS_RETURN]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/[WS_RETURN]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/[WS_RETURN]/INCONCLUSIVE/Cumulated/Count\" label=\"Inconclusive\" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_XMLFRAG\" name=\"Response Contain Verification Points\" helpId=\"wevp0020\"><views><Table><counterQueries><QueryInfo path=\"/WS_VP/WS_XML_FRAGMENT/[WS_RETURN]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UREQ\" nlunit=\"requests\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FRAGMENT/[WS_RETURN]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UREQ\" nlunit=\"requests\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FRAGMENT/[WS_RETURN]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UREQ\" nlunit=\"requests\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FRAGMENT/[WS_RETURN]/INCONCLUSIVE/Cumulated/Count\" label=\"Inconclusive\" counterType=\"COUNT_BASIC\" unit=\"UREQ\" nlunit=\"requests\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FRAGMENT/[WS_RETURN]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UREQ\" nlunit=\"requests\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_XMLFILE\" name=\"Response Equal Verification Points\" helpId=\"wevp0020\"><views><Table><counterQueries><QueryInfo path=\"/WS_VP/WS_XML_FILE/[WS_RETURN]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UEQUVP\" nlunit=\"equal vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FILE/[WS_RETURN]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UEQUVP\" nlunit=\"equal vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FILE/[WS_RETURN]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UEQUVP\" nlunit=\"equal vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FILE/[WS_RETURN]/INCONCLUSIVE/Cumulated/Count\" label=\"Inconclusive\" counterType=\"COUNT_BASIC\" unit=\"UEQUVP\" nlunit=\"equal vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FILE/[WS_RETURN]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UEQUVP\" nlunit=\"equal vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_XPATH\" name=\"Response Query Verification Points\" helpId=\"wevp0020\"><views><Table><counterQueries><QueryInfo path=\"/WS_VP/WS_XPATH/[WS_RETURN]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UXPVP\" nlunit=\"xpath vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XPATH/[WS_RETURN]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UXPVP\" nlunit=\"xpath vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XPATH/[WS_RETURN]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UXPVP\" nlunit=\"xpath vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XPATH/[WS_RETURN]/INCONCLUSIVE/Cumulated/Count\" label=\"Inconclusive\" counterType=\"COUNT_BASIC\" unit=\"UXPVP\" nlunit=\"xpath vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XPATH/[WS_RETURN]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UXPVP\" nlunit=\"xpath vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_XSD\" name=\"Response XSD Verification Points\" helpId=\"wevp0020\"><views><Table><counterQueries><QueryInfo path=\"/WS_VP/WS_XSD/[WS_RETURN]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UXSDVP\" nlunit=\"xsd vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XSD/[WS_RETURN]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UXSDVP\" nlunit=\"xsd vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XSD/[WS_RETURN]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UXSDVP\" nlunit=\"xsd vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XSD/[WS_RETURN]/INCONCLUSIVE/Cumulated/Count\" label=\"Inconclusive\" counterType=\"COUNT_BASIC\" unit=\"UXSDVP\" nlunit=\"xsd vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XSD/[WS_RETURN]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UXSDVP\" nlunit=\"xsd vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_ATTACH\" name=\"Response Attachment Verification Points\" helpId=\"wevp0020\"><views><Table><counterQueries><QueryInfo path=\"/WS_VP/WS_ATTACHMENT/[WS_RETURN]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UATTVP\" nlunit=\"attachment vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ATTACHMENT/[WS_RETURN]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UATTVP\" nlunit=\"attachment vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ATTACHMENT/[WS_RETURN]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UATTVP\" nlunit=\"attachment vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ATTACHMENT/[WS_RETURN]/INCONCLUSIVE/Cumulated/Count\" label=\"Inconclusive\" counterType=\"COUNT_BASIC\" unit=\"UATTVP\" nlunit=\"attachment vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ATTACHMENT/[WS_RETURN]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UATTVP\" nlunit=\"attachment vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_TEXT\" name=\"Response Text Verification Points\" helpId=\"wevp0020\"><views><Table><counterQueries><QueryInfo path=\"/WS_VP/WS_TEXT_VP/[WS_RETURN]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UTVPS\" nlunit=\"text vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_TEXT_VP/[WS_RETURN]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UTVPS\" nlunit=\"text vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_TEXT_VP/[WS_RETURN]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UTVPS\" nlunit=\"text vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_TEXT_VP/[WS_RETURN]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UTVPS\" nlunit=\"text vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"VP_TAB_TITLE_CALLBACK\" name=\"Callback Verification Points\" helpId=\"wevp0020\"><views><Table><counterQueries><QueryInfo path=\"/WS_VP/WS_CALLBACK_TIMEOUT_VP/[WS_CALLBACK]/PASS/Cumulated/Count\" label=\"Passed\" counterType=\"COUNT_BASIC\" unit=\"UCBTVP\" nlunit=\"callback time out vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_CALLBACK_TIMEOUT_VP/[WS_CALLBACK]/FAIL/Cumulated/Count\" label=\"Fail\" counterType=\"COUNT_BASIC\" unit=\"UCBTVP\" nlunit=\"callback time out vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_CALLBACK_TIMEOUT_VP/[WS_CALLBACK]/ERROR/Cumulated/Count\" label=\"Error\" counterType=\"COUNT_BASIC\" unit=\"UCBTVP\" nlunit=\"callback time out vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_CALLBACK_TIMEOUT_VP/[WS_CALLBACK]/INCONCLUSIVE/Cumulated/Count\" label=\"Inconclusive\" counterType=\"COUNT_BASIC\" unit=\"UCBTVP\" nlunit=\"callback time out vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_CALLBACK_TIMEOUT_VP/[WS_CALLBACK]/Percent Pass/Cumulated/Percent\" label=\"Percent passed\" counterType=\"PERCENT\" unit=\"UCBTVP\" nlunit=\"callback time out vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page></pages></Report>");}});});