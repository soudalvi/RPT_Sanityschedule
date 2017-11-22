﻿define(["dojo/_base/declare","jquery"], function(declare,$){return declare(null, {constructor: function () {},data : function () {return $.parseXML("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Report isDefault=\"true\" isUser=\"false\" hasUnresolvedCounterQueries=\"false\" version=\"4\" nlname=\"Loop_REPORT\" name=\"Loop Report\" helpProvider=\"com.ibm.rational.test.lt.execution.results\"><features><Feature>com.ibm.rational.test.lt.feature.lt</Feature></features><filter><requiredCounters><CounterInfo path=\"/Loops/Attempts/[LOOP]\"></CounterInfo></requiredCounters></filter><pages><Page nlname=\"OVERALL_LOOP_DETAILS\" name=\"Loop Invocation Details\" helpId=\"OverallLoopDetails\"><views><BarChart nlname=\"LOOP_COMPLETION_PERCENTAGE\" name=\"Loop Invocation Completion Percentage\"><counterQueries><QueryInfo path=\"/Loops/Completed/[LOOP]/LoopCompletionPercentageForInterval/Cumulated/Percent\" label=\"Loop Completion Percentage\" counterType=\"PERCENT\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"PERCENT\"></QueryInfo></counterQueries></BarChart><Table nlname=\"LOOP_DETAILS\" name=\"Loop Invocation Details\"><counterQueries><QueryInfo path=\"/Loops/Attempts/[LOOP]/Cumulated/Count\" label=\"Attempts\" counterType=\"COUNT_BASIC\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/Loops/Completed/[LOOP]/Cumulated/Count\" label=\"Completed\" counterType=\"COUNT_BASIC\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/Loops/Exited/[LOOP]/Cumulated/Count\" label=\"Exited\" counterType=\"COUNT_BASIC\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/Loops/Completed/[LOOP]/LoopCompletionPercentageForInterval/Cumulated/Percent\" label=\"Loop Completion Percentage\" counterType=\"PERCENT\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"LOOP_ITERATION_DETAILS\" name=\"Loop Iteration Details\" helpId=\"LoopIterationDetails\"><views><BarChart nlname=\"LOOP_ITERATION_COMPLETION_PERCENTAGE\" name=\"Loop Iteration Completion Percentage\"><counterQueries><QueryInfo path=\"/Loops/Iterations/[LOOP]/LoopIterationCompletionPercentageForInterval/Cumulated/Percent\" label=\"Loop Iteration Completion Percentage\" counterType=\"SPERCENT\" unit=\"UITERATIONS\" nlunit=\"iterations\" componentType=\"SPERCENT\"></QueryInfo></counterQueries></BarChart><Table nlname=\"LOOP_ITERATION_DETAILS\" name=\"Loop Iteration Details\"><counterQueries><QueryInfo path=\"/Loops/Iterations/Attempts/[LOOP]/Cumulated/Count\" label=\"Attempts\" counterType=\"COUNT_BASIC\" unit=\"UITERATIONS\" nlunit=\"iterations\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/Loops/Iterations/Completed/[LOOP]/Cumulated/Increment\" label=\"Completed\" counterType=\"INCREMENT_BASIC\" unit=\"UITERATIONS\" nlunit=\"iterations\" componentType=\"INCREMENT\"></QueryInfo><QueryInfo path=\"/Loops/Iterations/Exited/[LOOP]/Cumulated/Count\" label=\"Exited\" counterType=\"COUNT_BASIC\" unit=\"UITERATIONS\" nlunit=\"iterations\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/Loops/Iterations/[LOOP]/LoopIterationCompletionPercentageForInterval/Cumulated/Percent\" label=\"Loop Iteration Completion Percentage\" counterType=\"SPERCENT\" unit=\"UITERATIONS\" nlunit=\"iterations\" componentType=\"SPERCENT\"></QueryInfo></counterQueries></Table></views></Page><Page nlname=\"LOOP_ITERATION_HEALTH\" name=\"Loop Iteration Health\" helpId=\"ReptDefaultLoopHealth\"><views><BarChart nlname=\"HEALTH_FOR_RUN\" name=\"Health for run\"><counterQueries><QueryInfo path=\"/Loops/Health/[LOOP]/PercentHealthyForInterval/Cumulated/Percent\" label=\"Percent Healthy\" counterType=\"PERCENT\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"PERCENT\"></QueryInfo></counterQueries></BarChart><Table nlname=\"HEALTH_SUMMARY\" name=\"Health Summary\"><counterQueries><QueryInfo path=\"/Loops/Iterations/Attempts/[LOOP]/Cumulated/Count\" label=\"Attempts\" counterType=\"COUNT_BASIC\" unit=\"UITERATIONS\" nlunit=\"iterations\" componentType=\"COUNT\"></QueryInfo><QueryInfo path=\"/Loops/Health/[LOOP]/PercentHealthyForInterval/Cumulated/Percent\" label=\"Percent Healthy\" counterType=\"PERCENT\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"PERCENT\"></QueryInfo></counterQueries></Table><Table nlname=\"HEALTH_SUMMARY\" name=\"Health Summary\"><counterQueries><QueryInfo path=\"/Loops/Health/[LOOP]/Conditions/[ERRCONDITION]/Cumulated/Count\" label=\"Conditions\" counterType=\"COUNT_BASIC\" unit=\"ULOOPS\" nlunit=\"loops\" componentType=\"COUNT\"></QueryInfo></counterQueries></Table></views></Page></pages></Report>");}});});