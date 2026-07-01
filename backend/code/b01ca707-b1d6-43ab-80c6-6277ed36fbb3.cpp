#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<int,int> P;
typedef pair<int,P> P1;
typedef pair<P,P> P2;
#define pu push
#define pb push_back
#define mp make_pair
#define eps 1e-7
#define INF 1000000000
#define mod 1000000007
#define fi first
#define sc second
#define rep(i,x) for(int i=0;i<x;i++)
#define repn(i,x) for(int i=1;i<=x;i++)
#define SORT(x) sort(x.begin(),x.end())
#define ERASE(x) x.erase(unique(x.begin(),x.end()),x.end())
#define POSL(x,v) (lower_bound(x.begin(),x.end(),v)-x.begin())
#define POSU(x,v) (upper_bound(x.begin(),x.end(),v)-x.begin())
int n;
double p[3005];
double dp[3005][3005];
int main(){
	scanf("%d",&n);
	repn(i,n) scanf("%lf",&p[i]);
	dp[0][0] = 1;
	for(int i=1;i<=n;i++){
		for(int j=0;j<=i-1;j++){
			dp[i][j+1] += dp[i-1][j]*p[i];
			dp[i][j] += dp[i-1][j]*(1.0-p[i]);
		}
	}
	double ans = 0.0;
	for(int i=0;i<=n;i++) if(i > n-i) ans += dp[n][i];
	printf("%.12f\n",ans);
	}