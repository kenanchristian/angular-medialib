export default `
<div class="medialib-transaction-item" ng-repeat="transaction in manager.transactions" ng-class="{ dismissed: transaction.dismissed }">
  <div class="medialib-transaction-progress">
    <svg width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <circle ng-if="transaction.status === 'working' && transaction.progress < 100" cx="0" cy="0" r="20" fill="#2083DF" transform="translate(20 20)">
        <animateTransform attributeName="transform" type="scale" additive="sum" from="0.6 0.6" to="1 1" begin="0s" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="20" r="12" fill="{{ (transaction.status === 'failed' ? '#d83c3c' : (transaction.progress < 100 ? '#2083DF' : '#2FA266' )) }}" />
      <circle cx="20" cy="20" r="16" stroke="{{ (transaction.status === 'failed' ? '#d83c3c' : (transaction.progress < 100 ? '#2083DF' : '#2FA266' )) }}"
        stroke-width="2px" fill="transparent" transform="rotate(270, 20, 20)" stroke-dasharray="100" stroke-dashoffset="{{100 - transaction.progress}}" style="transition: stroke-dashoffset 1s linear;"></circle>
      <text ng-if="transaction.status === 'working'" x="20" y="24" text-anchor="middle" font-family="Verdana" font-size="12" stroke="#FFFFFF">{{transaction.progress}}</text>
      <path ng-if="transaction.progress >= 100 && transaction.status === 'failed'" d="M13,25 L18,20 L13,15 L15,13 L20,18 L25,13 L27,15 L22,20 L27,25 L25,27 L20,22 L15,27 L13,25 Z" fill="#FFFFFF"></path>
      <path ng-if="transaction.progress >= 100 && transaction.status === 'complete'" d="M28,16 L17,26 L17,26 L15,24 L12,21 L14,19 L17,22 L26,14 L28,16 Z" fill="#FFFFFF"></path>
    </svg>
  </div>
  <div class="medialib-transaction-body">
    <div class="medialib-transaction-title">{{ transaction.title }}</div>
    <div class="medialib-transaction-message">{{ transaction.message }}</div>
  </div>
  <div class="medialib-transaction-action" ng-click="transaction.fail(true)">×</div>
</div>`
