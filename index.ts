interface Patient {
  time: number;
}

Page({
  data: {
    patients: [] as Patient[],
    totalDosage: null as number | null,
    totalPatients: 0,
    halfLife: 110, // 半衰期110分钟
    averageDosage: 7.5, // 默认平均需求量7.5mCi
    textData: '' as string
  },

  // 处理粘贴输入
  bindTextInput(e: WechatMiniprogram.Input) {
    this.setData({
      textData: e.detail.value
    });
  },

  // 更新平均需求量
  bindAverageDosageInput(e: WechatMiniprogram.Input) {
    this.setData({
      averageDosage: parseFloat(e.detail.value)
    });
  },

  // 解析多行数据
  parseData() {
    const textData = this.data.textData;
    if (!textData) return;

    const lines = textData.split('\n');
    const patients: Patient[] = lines.map(line => {
      const time = parseFloat(line.trim());
      return { time: isNaN(time) ? 0 : time };
    }).filter(patient => patient.time > 0); // 过滤掉无效数据

    this.setData({
      patients: patients,
      totalPatients: patients.length,
      totalDosage: null
    });
  },

  calculateDosage() {
    const { patients, halfLife, averageDosage } = this.data;
    if (patients.length === 0) return;

    const decayConstant = Math.log(2) / halfLife;
    let totalDosage = 0;

    patients.forEach(patient => {
      const decayFactor = Math.exp(-decayConstant * patient.time);
      totalDosage += averageDosage / decayFactor;
    });

    this.setData({
      totalDosage: parseFloat(totalDosage.toFixed(2)),
      totalPatients: patients.length
    });
  }
});
