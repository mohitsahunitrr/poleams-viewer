<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%@ page contentType="text/html" pageEncoding="UTF-8" session="false"  isELIgnored="false"%>

<%@ page import="com.windams.bean.*" %>
<%@ page import="com.windams.domain.*" %>
<%@ page import="com.windams.webapp.MVCConstants" %>

<div id="footer">
    <div class="container-fluid">
        <p class="text-muted">&copy;<spring:message code="base.copyright" text="2013 WindAMS"/></p>
    </div>
</div>

<!-- Bootstrap core JavaScript
================================================== -->
<!-- ==== Needed for Authorization (Decrypting JWT) ==== -->
<script src="<spring:url value="/js/jose.min.js" htmlEscape="true"/>"></script>
<!-- ==== Needed for Authentication ==== -->
<script src="<spring:url value="/js/sha256-min.js" htmlEscape="true"/>"></script>
<script src="<spring:url value="/js/thinbus-srp6a-config.js" htmlEscape="true"/>"></script>
<script src="<spring:url value="/js/thinbus-srp6a-sha256-versioned.js" htmlEscape="true"/>"></script>
<script src="<spring:url value="/js/authenticate.js" htmlEscape="true"/>"></script>
