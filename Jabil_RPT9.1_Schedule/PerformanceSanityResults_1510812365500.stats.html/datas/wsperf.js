﻿define(["dojo/_base/declare","jquery"], function(declare,$){return declare(null, {constructor: function () {},data : function () {return $.parseXML("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Report isDefault=\"true\" isUser=\"false\" hasUnresolvedCounterQueries=\"false\" version=\"4\" nlname=\"WS_PERF_REPORT\" name=\"Service Performance Report\" helpProvider=\"com.ibm.rational.test.lt.execution.results\"><features><Feature>com.ibm.rational.test.lt.feature.lt</Feature><Feature>com.ibm.rational.test.lt.ws.feature</Feature></features><pages><Page nlname=\"TAB_TITLE_OVERALL\" name=\"Overall\" helpId=\"wepr0010\"><views><RunStatus></RunStatus><BarChart><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_GOODNESS/Percent_WS_Call_Goodness_For_Interval/Cumulated/Percent\" label=\"Percent Request Success \" counterType=\"PERCENT\" unit=\"UATP\" nlunit=\"calls\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_CALLBACK/WS_CALLBACK_GOODNESS/Percent_WS_Callback_Goodness_For_Interval/Cumulated/Percent\" label=\"Percent Callback Success \" counterType=\"PERCENT\" unit=\"UCBA\" nlunit=\"callbacks attempts\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FRAGMENT/Percent_WS_XML_FRAGMENT_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent Contain VPs Passed \" counterType=\"PERCENT\" unit=\"UREQ\" nlunit=\"requests\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XPATH/Percent_WS_XPATH_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent Query VPs Passed \" counterType=\"PERCENT\" unit=\"UXPVP\" nlunit=\"xpath vps\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XSD/Percent_WS_XSD_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent XSD VPs Passed \" counterType=\"PERCENT\" unit=\"UXSDVP\" nlunit=\"xsd vps\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_XML_FILE/Percent_WS_XML_FILE_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent Equal VPs Passed \" counterType=\"PERCENT\" unit=\"UEQUVP\" nlunit=\"equal vps\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ATTACHMENT/Percent_WS_ATTACHMENT_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent Attachment VPs Passed \" counterType=\"PERCENT\" unit=\"UATTVP\" nlunit=\"attachment vps\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_TEXT_VP/Percent_WS_TEXT_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent Text VPs Passed \" counterType=\"PERCENT\" unit=\"UTVPS\" nlunit=\"text vps\" componentType=\"PERCENT\"></QueryInfo></counterQueries></BarChart></views></Page><Page nlname=\"TAB_TITLE_SUMMARY\" name=\"Summary\" helpId=\"wepr0020\"><views><Table nlname=\"TABLE_TITLE_RUN_SUMMARY\" name=\"Run Summary\"><counterQueries><QueryInfo path=\"/Run/Schedule/Executed Test/Cumulated\" label=\"Executed Test\" counterType=\"TEXT_UPDATABLE\" componentType=\"TEXT\"></QueryInfo><QueryInfo path=\"/Run/Active Users/Cumulated/Increment\" label=\"Active Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo><QueryInfo path=\"/Run/Completed Users/Cumulated/Increment\" label=\"Completed Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo><QueryInfo path=\"/Run/Total Users/Cumulated/Increment\" label=\"Total Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo><QueryInfo path=\"/Run/Run Duration/Cumulated/Count\" label=\"Elapsed Time\" counterType=\"COUNT_BASIC\" unit=\"UMS\" nlunit=\"ms\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/Run/Run Status/Final/Cumulated\" label=\"Run Status\" counterType=\"TEXT_UPDATABLE\" unit=\"URUNSTATUS\" nlunit=\"run statuses\" componentType=\"TEXT\"></QueryInfo><QueryInfo path=\"/Run/Primary Node\" label=\"Displaying Results for Computer:\" counterType=\"TEXT_UPDATABLE\" componentType=\"TEXT\"></QueryInfo><QueryInfo path=\"/Performance Requirements/PR_OVERALL/Cumulated/Status\" label=\"Performance Requirements\" counterType=\"REQUIREMENT_VERDICT\" unit=\"UUNSPECIFIED\" nlunit=\"\" componentType=\"REQVERDICT_STATUS\"></QueryInfo><QueryInfo path=\"/Performance Requirements/PR_OVERALL/Cumulated/FailCount\" label=\"Performance Requirements\" counterType=\"REQUIREMENT_VERDICT\" unit=\"UUNSPECIFIED\" nlunit=\"\" componentType=\"REQVERDICT_COUNT\"></QueryInfo><QueryInfo path=\"/Performance Requirements/PR_OVERALL/Cumulated/PassCount\" label=\"Performance Requirements\" counterType=\"REQUIREMENT_VERDICT\" unit=\"UUNSPECIFIED\" nlunit=\"\" componentType=\"REQVERDICT_COUNT\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_CALL_SUMMARY\" name=\"Request Summary\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_ATTEMPTS/Total_WS_Call_Started_For_Interval/Cumulated/Count\" label=\"Total Request Started \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_GOODNESS/Total_WS_Call_Goodness_For_Interval/Cumulated/Count\" label=\"Total Request Success \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_TIMEOUTS/Total_WS_Call_Timeout_For_Interval/Cumulated/Count\" label=\"Total Request Timeout \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/Percent_WS_ALL_VPs_Passed_For_Interval/Cumulated/Percent\" label=\"Percent All VPs Passed \" counterType=\"PERCENT\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"PERCENT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/Total_WS_ALL_VPs_Failed_For_Interval/Cumulated/Count\" label=\"Total All VPs Failed \" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_VP/WS_ALL_VP/Total_WS_ALL_VPs_Error_For_Interval/Cumulated/Count\" label=\"Total All VPs Error \" counterType=\"COUNT_BASIC\" unit=\"UVPS\" nlunit=\"vps\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/Average_WS_Response_Time_For_All_Returns_For_Interval/Cumulated/Mean\" label=\"Average Response Time For All Requests  \" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MEAN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/Average_WS_Response_Time_For_All_Returns_For_Interval/Cumulated/Max\" label=\"Average Response Time For All Requests  \" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/Average_WS_Response_Time_For_All_Returns_For_Interval/Cumulated/Min\" label=\"Average Response Time For All Requests  \" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/Average_WS_Response_Time_For_All_Returns_For_Interval/Cumulated/StdDev\" label=\"Average Response Time For All Requests  \" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_STDDEV\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_ATTEMPTS/Total_WS_Call_Started_For_Interval/Cumulated/MaxRate\" label=\"Total Request Started \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_ATTEMPTS/Total_WS_Call_Started_For_Interval/Cumulated/MinRate\" label=\"Total Request Started \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_GOODNESS/Total_WS_Call_Goodness_For_Interval/Cumulated/MaxRate\" label=\"Total Request Success \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_GOODNESS/Total_WS_Call_Goodness_For_Interval/Cumulated/MinRate\" label=\"Total Request Success \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_FAILS/Total_WS_Call_Fail_For_Interval/Cumulated/MaxRate\" label=\"Total Request Fail \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_FAILS/Total_WS_Call_Fail_For_Interval/Cumulated/MinRate\" label=\"Total Request Fail \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_TIMEOUTS/Total_WS_Call_Timeout_For_Interval/Cumulated/MaxRate\" label=\"Total Request Timeout \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_TIMEOUTS/Total_WS_Call_Timeout_For_Interval/Cumulated/MinRate\" label=\"Total Request Timeout \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE_MIN\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_BYTES_SUMMARY\" name=\"Bytes Summary\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/Total_WS_Call_Send_Byte_For_Interval/Cumulated/Rate\" label=\"Total Sent Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/Total_WS_Call_Send_Byte_For_Interval/Cumulated/MaxRate\" label=\"Total Sent Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/Total_WS_Call_Send_Byte_For_Interval/Cumulated/MinRate\" label=\"Total Sent Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/Total_WS_Call_Send_Byte_For_Interval/Cumulated/Count\" label=\"Total Sent Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/Total_WS_Call_Rec_Byte_For_Interval/Cumulated/Rate\" label=\"Total Received Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/Total_WS_Call_Rec_Byte_For_Interval/Cumulated/MaxRate\" label=\"Total Received Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/Total_WS_Call_Rec_Byte_For_Interval/Cumulated/MinRate\" label=\"Total Received Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/Total_WS_Call_Rec_Byte_For_Interval/Cumulated/Count\" label=\"Total Received Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"TAB_TITLE_RESPTIME\" name=\"Response Time Results\" helpId=\"wepr0030\"><views><BarChart nlname=\"BAR_TITLE_RESPTIME\" name=\"Average Response Time for Run\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/Mean\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MEAN\"></QueryInfo></counterQueries></BarChart><Table nlname=\"TABLE_TITLE_RESPTIME_PERF\" name=\"Performance Summary\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/Min\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/Mean\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MEAN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/Max\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/StdDev\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_STDDEV\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"TAB_TITLE_RT_TS\" name=\"Response Time vs. Time Summary\" helpId=\"wepr0040\"><views><LineChart nlname=\"LINE_TITLE_RT_TS\" name=\"Response Time vs. Time\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/Average_WS_Response_Time_For_All_Returns_For_Interval/Mean\" label=\"Average Response Time For All Requests  \" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MEAN\"></QueryInfo></counterQueries></LineChart><Table nlname=\"TABLE_TITLE_RT_TS_PERF\" name=\"Performance Summary\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/Average_WS_Response_Time_For_All_Returns_For_Interval/Cumulated/Mean\" label=\"Average Response Time For All Requests  \" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MEAN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/Average_WS_Response_Time_For_All_Returns_For_Interval/Cumulated/StdDev\" label=\"Average Response Time For All Requests  \" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_STDDEV\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"TAB_TITLE_RT_TD\" name=\"Response Time vs. Time Details\" helpId=\"wepr0050\"><views><LineChart nlname=\"LINE_TITLE_RT_TD\" name=\"Average Response Time for Interval\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Mean\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MEAN\"></QueryInfo></counterQueries></LineChart><Table nlname=\"TABLE_TITLE_RT_TD_PERF\" name=\"Performance Summary\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/Min\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/Mean\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MEAN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/Max\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_MAX\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RESPONSE_TIME/[WS_CALL]/Cumulated/StdDev\" label=\"Response Time\" counterType=\"VALUE_DISTRIBUTION\" unit=\"UMS\" nlunit=\"ms\" componentType=\"VALUE_STDDEV\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"TAB_TITLE_BYTES\" name=\"Data Volume\" helpId=\"wepr0080\"><views><LineChart nlname=\"LINE_TITLE_BT\" name=\"Sent and Received\" lineSmoothing=\"false\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/Total_WS_Call_Send_Byte_For_Interval/Rate\" label=\"Total Sent Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/Total_WS_Call_Rec_Byte_For_Interval/Rate\" label=\"Total Received Bytes \" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE\"></QueryInfo></counterQueries></LineChart><Table nlname=\"TABLE_TITLE_BT_RCVD\" name=\"Received Summary [Bytes]\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/[WS_CALL]/Cumulated/Count\" label=\"Received Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/[WS_CALL]/Cumulated/Rate\" label=\"Received Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/[WS_CALL]/Cumulated/MinRate\" label=\"Received Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_RECEIVED_BYTE/[WS_CALL]/Cumulated/MaxRate\" label=\"Received Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MAX\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_BT_SENT\" name=\"Sent Summary [Bytes]\"><counterQueries><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/[WS_CALL]/Cumulated/Count\" label=\"Sent Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/[WS_CALL]/Cumulated/Rate\" label=\"Sent Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/[WS_CALL]/Cumulated/MinRate\" label=\"Sent Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MIN\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_SEND_BYTE/[WS_CALL]/Cumulated/MaxRate\" label=\"Sent Bytes\" counterType=\"COUNT_RATE_RANGE\" unit=\"UBTS\" nlunit=\"bytes\" componentType=\"RATE_MAX\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"TAB_TITLE_USER\" name=\"Request Throughput\" helpId=\"wepr0060\"><views><LineChart nlname=\"LINE_TITLE_USER_CALL\" name=\"Requests Performed Rate\" lineSmoothing=\"false\"><layoutData><RowLayoutData col=\"1\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_ATTEMPTS/Total_WS_Call_Started_For_Interval/Rate\" label=\"Total Request Started \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_GOODNESS/Total_WS_Call_Goodness_For_Interval/Rate\" label=\"Total Request Success \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_TIMEOUTS/Total_WS_Call_Timeout_For_Interval/Rate\" label=\"Total Request Timeout \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_FAILS/Total_WS_Call_Fail_For_Interval/Rate\" label=\"Total Request Fail \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"RATE\"></QueryInfo></counterQueries></LineChart><LineChart nlname=\"LINE_TITLE_USER\" name=\"User Load\" lineSmoothing=\"false\"><layoutData><RowLayoutData col=\"2\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/Run/Active Users/Cumulated/Increment\" label=\"Active Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo><QueryInfo path=\"/Run/Completed Users/Cumulated/Increment\" label=\"Completed Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo></counterQueries></LineChart><Table nlname=\"TABLE_TITLE_USER_CALL_PERF\" name=\"Performance Summary\"><layoutData><RowLayoutData col=\"1\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_ATTEMPTS/Total_WS_Call_Started_For_Interval/Cumulated/Count\" label=\"Total Request Started \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_GOODNESS/Total_WS_Call_Goodness_For_Interval/Cumulated/Count\" label=\"Total Request Success \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_TIMEOUTS/Total_WS_Call_Timeout_For_Interval/Cumulated/Count\" label=\"Total Request Timeout \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/WS_CALL/WS_CALL_FAILS/Total_WS_Call_Fail_For_Interval/Cumulated/Count\" label=\"Total Request Fail \" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_USER_PERF\" name=\"Performance Summary\"><layoutData><RowLayoutData col=\"2\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/Run/Active Users/Cumulated/Increment\" label=\"Active Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo><QueryInfo path=\"/Run/Completed Users/Cumulated/Increment\" label=\"Completed Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo><QueryInfo path=\"/Run/Total Users/Cumulated/Increment\" label=\"Total Users\" counterType=\"INCREMENT_EXTENT\" unit=\"UUSERS\" nlunit=\"users\" componentType=\"INCREMENT\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_USER_CALL_PERF_DET\" name=\"Performance Details\"><layoutData><RowLayoutData col=\"1\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_ATTEMPTS/[WS_CALL]/Cumulated/Count\" label=\"Request Starts\" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_USER_CALL_PERF_DET\" name=\"Performance Details\"><layoutData><RowLayoutData col=\"2\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_GOODNESS/[WS_CALL]/Cumulated/Count\" label=\"Request Success\" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_USER_CALL_PERF_DET\" name=\"Performance Details\"><layoutData><RowLayoutData col=\"1\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_TIMEOUTS/[WS_CALL]/Cumulated/Count\" label=\"Request Timeouts\" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table><Table nlname=\"TABLE_TITLE_USER_CALL_PERF_DET\" name=\"Performance Details\"><layoutData><RowLayoutData col=\"2\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/WS_CALL/WS_CALL_FAILS/[WS_CALL]/Cumulated/Count\" label=\"Request Fails\" counterType=\"COUNT_RATE_RANGE\" unit=\"UATP\" nlunit=\"calls\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"TAB_TITLE_RESOURCE\" name=\"Resources\" helpId=\"wepr0070\"><filter><requiredCounters><CounterInfo path=\"/ResourceMonitoring/[RESOURCE]\"></CounterInfo></requiredCounters></filter><views><LineChart nlname=\"LINE_TITLE_RESOURCE\" name=\"Resources\" scalePer=\"RESOURCE\"><counterQueries><QueryInfo path=\"/ResourceMonitoring/[RESOURCE]/Mean\" label=\"Resource Monitoring\" counterType=\"VALUE_RANGE\" unit=\"URESOURCES\" nlunit=\"resources\" componentType=\"VALUE_MEAN\"></QueryInfo></counterQueries></LineChart><Table nlname=\"TABLE_TITLE_RESOURCE_PERF\" name=\"Performance Summary\"><layoutData><RowLayoutData col=\"2\"></RowLayoutData></layoutData><counterQueries><QueryInfo path=\"/ResourceMonitoring/[RESOURCE]/Cumulated/Mean\" label=\"Resource Monitoring\" counterType=\"VALUE_RANGE\" unit=\"URESOURCES\" nlunit=\"resources\" componentType=\"VALUE_MEAN\"></QueryInfo><QueryInfo path=\"/ResourceMonitoring/[RESOURCE]/Cumulated/Min\" label=\"Resource Monitoring\" counterType=\"VALUE_RANGE\" unit=\"URESOURCES\" nlunit=\"resources\" componentType=\"VALUE_MIN\"></QueryInfo><QueryInfo path=\"/ResourceMonitoring/[RESOURCE]/Cumulated/Max\" label=\"Resource Monitoring\" counterType=\"VALUE_RANGE\" unit=\"URESOURCES\" nlunit=\"resources\" componentType=\"VALUE_MAX\"></QueryInfo></counterQueries></Table></views></Page></pages></Report>");}});});