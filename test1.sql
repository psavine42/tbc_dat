


SELECT TOP (100) PERCENT 
  a.recnum AS [JobNumber], 
  a.jobnme AS [JobName], 
  a.cntrct AS [CurrentContract], 
  c.chgttl AS [TotalChangeOrders], 
  l.ttlbdgt AS [CurrentBudget], 
  l.hrsbdgt AS [TotalEstimatedHours], 
  jcosts.csthrst AS [TotalActualHours],
  jcosts.cstamtt AS [CostToDate], 
  a.bal AS [BilledToDate]
FROM
 (SELECT TOP (100) PERCENT SUM(appamt) AS chgttl, jobnum
  FROM    dbo.prmchg
  WHERE   (status = 1)
  GROUP BY jobnum) 
  AS c 
  FULL OUTER JOIN

 (SELECT  TOP (100) PERCENT recnum, jobnme, cntrct, endbal + begbal AS bal
  FROM    dbo.actrec
  WHERE   recnum = 16) 
  AS a 
  ON a.recnum = c.jobnum 
  FULL OUTER JOIN

 (SELECT TOP (100) PERCENT jobnum, SUM(csthrs) AS csthrst, SUM(cstamt) AS cstamtt
  FROM    dbo.jobcst
  WHERE   (status = 1)
  GROUP BY jobnum) 
  AS jcosts 
  ON a.recnum = jcosts.jobnum 
  FULL OUTER JOIN

 (SELECT TOP (100) PERCENT recnum, SUM(hrsorg) AS hrsorgt, SUM(hrsbdg) 
          AS hrsbdgt, SUM(ttlorg) AS ttlorgt, SUM(ttlbdg) AS ttlbdgt
  FROM            dbo.bdglin
  GROUP BY recnum) 
  AS l 
  ON a.recnum = l.recnum

ORDER BY [JobNumber] 





SELECT TOP (100) PERCENT 
  a.recnum AS [JobNumber], 
  a.jobnme AS [JobName], 
  a.cntrct AS [CurrentContract], 
  co.chgttl AS [TotalChangeOrders], 
  bdglin.ttlbdgt AS [CurrentBudget], 
  bdglin.hrsbdgt AS [TotalEstimatedHours], 
  cost.csthrst AS [TotalActualHours],
  cost.cstamtt AS [CostToDate], 
  a.bal AS [BilledToDate]
FROM
 (SELECT TOP (100) PERCENT SUM(appamt) AS chgttl, jobnum
  FROM    dbo.prmchg
  WHERE   (status = 1) AND (jobnum = 16))
  AS co 
  FULL OUTER JOIN

 (SELECT  TOP (100) PERCENT recnum, jobnme, cntrct, endbal + begbal AS bal
  FROM    dbo.actrec
  WHERE   recnum = 16) 
  AS a 
  ON a.recnum = co.jobnum 
  FULL OUTER JOIN

 (SELECT TOP (100) PERCENT jobnum, SUM(csthrs) AS csthrst, SUM(cstamt) AS cstamtt
  FROM    dbo.jobcst
  WHERE   (status = 1)) 
  AS cost 
  ON a.recnum = cost.jobnum 
  FULL OUTER JOIN

 (SELECT TOP (100) PERCENT recnum, SUM(hrsorg) AS hrsorgt, SUM(hrsbdg) AS hrsbdgt, SUM(ttlorg) AS ttlorgt, SUM(ttlbdg) AS ttlbdgt
  FROM            dbo.bdglin) 
  AS bdglin
  ON a.recnum = bdglin.recnum

