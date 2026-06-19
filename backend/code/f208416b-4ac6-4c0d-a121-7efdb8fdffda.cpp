
  // Include the input/output stream library
  #include <iostream> 
  #include <bits/stdc++.h>
  using namespace std;

  // Define the main function
  int main() { 
      //Output "Hello World!" to the console
            int n;
      cin>>n;
      
      vector<int>v(n);
      for(int i=0;i<n;i++ ){
        cin>>v[i];
      }
      
      int t;
      cin>>t;
      
      unordered_map<int,int>m;
      for(int i=0;i<n;i++){
        m[v[i]]=i;
      }
      
      for(int i=0;i<n;i++) {
        if(m.find(t-v[i])!=m.end()){
          cout<<m[v[i]]<<" "<<m[t-v[i]];
          break;
        }
      }

      // Return 0 to indicate successful execution
      return 0; 
  }