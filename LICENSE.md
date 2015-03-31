"C:\Program Files\Java\jdk1.8.0_25\bin\java" -Didea.launcher.port=7533 "-Didea.launcher.bin.path=C:\Program Files (x86)\JetBrains\IntelliJ IDEA Community Edition 13.1.5\bin" -Dfile.encoding=UTF-8 -classpath "C:\Program Files\Java\jdk1.8.0_25\jre\lib\charsets.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\deploy.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\javaws.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\jce.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\jfr.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\jfxswt.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\jsse.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\management-agent.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\plugin.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\resources.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\rt.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\access-bridge-64.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\cldrdata.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\dnsns.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\jaccess.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\jfxrt.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\localedata.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\nashorn.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\sunec.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\sunjce_provider.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\sunmscapi.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\sunpkcs11.jar;C:\Program Files\Java\jdk1.8.0_25\jre\lib\ext\zipfs.jar;C:\Users\joao-carloto\Dropbox\Test Path\target\classes;C:\Program Files (x86)\JetBrains\IntelliJ IDEA Community Edition 13.1.5\lib\idea_rt.jar" com.intellij.rt.execution.application.AppMain test_tracer.Main


Type: Action
Name: Order Placed
Documentation: null
ID: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_8A034DE2_F79B_4156_87A4_F5A96B210BB0 | Visits: 0


Type: Object
Name: Invoice
Documentation: null
ID: EAID_C3685E57_1931_4bb0_9D5A_283A04A616A8
Owner ID: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9
Out Node: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9 | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE | Visits: 0


Type: ActivityPartition
Name: Order
Documentation: null
ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Owner ID: null
Owned Node: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB
Owned Node: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC
Owned Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209
Owned Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A
Owned Node: EAID_8A034DE2_F79B_4156_87A4_F5A96B210BB0
Owned Node: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF
Owned Node: EAID_99DF751E_425F_491d_B58C_C8609354DEED


Type: ActivityPartition
Name: Transaction
Documentation: null
ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Owner ID: null
Owned Node: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9
Owned Node: EAID_D28E370F_7343_4033_B6A2_290136F547DE
Owned Node: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7


Type: Action
Name: Close Order
Documentation: null
ID: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_B97349DA_756F_485e_B706_516F4E621000 | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209 | Visits: 0


Type: Action
Name: Customer Payment
Documentation: null
ID: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9
Owner ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Owned Node: EAID_C3685E57_1931_4bb0_9D5A_283A04A616A8
Out Node: EAID_D28E370F_7343_4033_B6A2_290136F547DE | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false


Type: Object
Name: Invoice
Documentation: null
ID: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE
Owner ID: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7
Out Node: EAID_C3685E57_1931_4bb0_9D5A_283A04A616A8 | Name: null | Type: ObjectFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false


Type: Decision
Name: null
Documentation: null
ID: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A | Visits: 0
In Node: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF | Visits: 0


Type: Action
Name: Process Payment
Documentation: null
ID: EAID_D28E370F_7343_4033_B6A2_290136F547DE
Owner ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Out Node: EAID_99DF751E_425F_491d_B58C_C8609354DEED | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9 | Visits: 0


Type: Decision
Name: null
Documentation: null
ID: EAID_98E672E9_820A_448c_8111_7161A8DDB03A
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209 | Name: null | Type: ControlFlow | Guard: Order Rejected | Visits: 0 | Dry: false | Loop Entry: false
Out Node: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7 | Name: Order verified | Type: ControlFlow | Guard: Order Accepted | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB | Visits: 0


Type: Initial
Name: null
Documentation: null
ID: EAID_8A034DE2_F79B_4156_87A4_F5A96B210BB0
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false


Type: Action
Name: Send Invoice
Documentation: null
ID: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7
Owner ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Owned Node: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE
Out Node: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A | Visits: 0


Type: Final
Name: null
Documentation: null
ID: EAID_B97349DA_756F_485e_B706_516F4E621000
Owner ID: null
In Node: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC | Visits: 0


Type: Action
Name: Send Order
Documentation: null
ID: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209 | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_99DF751E_425F_491d_B58C_C8609354DEED | Visits: 0


Type: Action
Name: Package Order
Documentation: null
ID: EAID_99DF751E_425F_491d_B58C_C8609354DEED
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF | Name: null | Type: ControlFlow | Guard: null | Visits: 0 | Dry: false | Loop Entry: false
In Node: EAID_D28E370F_7343_4033_B6A2_290136F547DE | Visits: 0


Type: Action
Name: Order Placed
Documentation: null
ID: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A | Name: null | Type: ControlFlow | Guard: null | Visits: 2 | Dry: false | Loop Entry: false
In Node: EAID_8A034DE2_F79B_4156_87A4_F5A96B210BB0 | Visits: 0


Type: Object
Name: Invoice
Documentation: null
ID: EAID_C3685E57_1931_4bb0_9D5A_283A04A616A8
Owner ID: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9
Out Node: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9 | Name: null | Type: ControlFlow | Guard: null | Visits: 1 | Dry: false | Loop Entry: false
In Node: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE | Visits: 0


Type: ActivityPartition
Name: Order
Documentation: null
ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Owner ID: null
Owned Node: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB
Owned Node: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC
Owned Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209
Owned Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A
Owned Node: EAID_8A034DE2_F79B_4156_87A4_F5A96B210BB0
Owned Node: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF
Owned Node: EAID_99DF751E_425F_491d_B58C_C8609354DEED


Type: ActivityPartition
Name: Transaction
Documentation: null
ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Owner ID: null
Owned Node: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9
Owned Node: EAID_D28E370F_7343_4033_B6A2_290136F547DE
Owned Node: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7


Type: Action
Name: Close Order
Documentation: null
ID: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_B97349DA_756F_485e_B706_516F4E621000 | Name: null | Type: ControlFlow | Guard: null | Visits: 2 | Dry: false | Loop Entry: false
In Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209 | Visits: 0


Type: Action
Name: Customer Payment
Documentation: null
ID: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9
Owner ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Owned Node: EAID_C3685E57_1931_4bb0_9D5A_283A04A616A8
Out Node: EAID_D28E370F_7343_4033_B6A2_290136F547DE | Name: null | Type: ControlFlow | Guard: null | Visits: 1 | Dry: false | Loop Entry: false


Type: Object
Name: Invoice
Documentation: null
ID: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE
Owner ID: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7
Out Node: EAID_C3685E57_1931_4bb0_9D5A_283A04A616A8 | Name: null | Type: ObjectFlow | Guard: null | Visits: 1 | Dry: false | Loop Entry: false


Type: Decision
Name: null
Documentation: null
ID: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC | Name: null | Type: ControlFlow | Guard: null | Visits: 2 | Dry: false | Loop Entry: false
In Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A | Visits: 0
In Node: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF | Visits: 0


Type: Action
Name: Process Payment
Documentation: null
ID: EAID_D28E370F_7343_4033_B6A2_290136F547DE
Owner ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Out Node: EAID_99DF751E_425F_491d_B58C_C8609354DEED | Name: null | Type: ControlFlow | Guard: null | Visits: 1 | Dry: false | Loop Entry: false
In Node: EAID_CA6E9C5A_F7F1_458f_9D18_C93C34B624F9 | Visits: 0


Type: Decision
Name: null
Documentation: null
ID: EAID_98E672E9_820A_448c_8111_7161A8DDB03A
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209 | Name: null | Type: ControlFlow | Guard: Order Rejected | Visits: 1 | Dry: true | Loop Entry: false
Out Node: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7 | Name: Order verified | Type: ControlFlow | Guard: Order Accepted | Visits: 1 | Dry: true | Loop Entry: false
In Node: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB | Visits: 0


Type: Initial
Name: null
Documentation: null
ID: EAID_8A034DE2_F79B_4156_87A4_F5A96B210BB0
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_4547AE1A_A758_4199_B196_C91211DA8AFB | Name: null | Type: ControlFlow | Guard: null | Visits: 2 | Dry: false | Loop Entry: false


Type: Action
Name: Send Invoice
Documentation: null
ID: EAID_F7F5E609_E09D_4fba_9316_D12269A511A7
Owner ID: EAID_74DE62A1_DFA4_4ba1_9EE1_C1CAFB80A65A
Owned Node: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE
Out Node: EAID_B4AA6D5A_D013_464d_B858_AD955BBB86AE | Name: null | Type: ControlFlow | Guard: null | Visits: 1 | Dry: false | Loop Entry: false
In Node: EAID_98E672E9_820A_448c_8111_7161A8DDB03A | Visits: 0


Type: Final
Name: null
Documentation: null
ID: EAID_B97349DA_756F_485e_B706_516F4E621000
Owner ID: null
In Node: EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC | Visits: 0


Type: Action
Name: Send Order
Documentation: null
ID: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209 | Name: null | Type: ControlFlow | Guard: null | Visits: 1 | Dry: false | Loop Entry: false
In Node: EAID_99DF751E_425F_491d_B58C_C8609354DEED | Visits: 0


Type: Action
Name: Package Order
Documentation: null
ID: EAID_99DF751E_425F_491d_B58C_C8609354DEED
Owner ID: EAID_6A1FCDFC_2EA9_4a62_A539_62C04E89EFE3
Out Node: EAID_93ACD9A8_0C89_43a2_84CF_82E9755F10BF | Name: null | Type: ControlFlow | Guard: null | Visits: 1 | Dry: false | Loop Entry: false
In Node: EAID_D28E370F_7343_4033_B6A2_290136F547DE | Visits: 0

outT.outNodeId:
EAID_F7F5E609_E09D_4fba_9316_D12269A511A7

activityPath.get(k):
EAID_F7F5E609_E09D_4fba_9316_D12269A511A7

outT.outNodeId:
EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC

activityPath.get(k):
EAID_32DDAE25_E735_4e3b_BE0C_CC146D4E72CC

outT.outNodeId:
EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209

activityPath.get(k):
EAID_88631CA3_C395_4eeb_9C51_055EC4E6E209

2 Test Cases


Test nº1

Step 1: As a Order, Order Placed. Provide conditions for a "Order Accepted" decision.
Step 2: As a Transaction, Send Invoice.
Step 3: A Invoice is created and sent to Customer Payment
Step 4: As a Transaction, Customer Payment.
Step 5: As a Transaction, Process Payment.
Step 6: As a Order, Package Order.
Step 7: As a Order, Send Order.
Step 8: As a Order, Close Order.


Test nº2

Step 1: As a Order, Order Placed. Provide conditions for a "Order Rejected" decision.
Step 2: As a Order, Close Order.

Process finished with exit code 0
